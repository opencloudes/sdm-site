package main

import (
	"bytes"
	"context"
	"crypto/ed25519"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/gorilla/websocket"
)

const defaultPort = "8790"
const (
	transportWebhook         = "webhook"
	transportOpenClawGateway = "openclaw-gateway"
)

type config struct {
	Port                 string
	AllowedOrigin        string
	AgentTransport       string
	AgentURL             string
	AgentToken           string
	FallbackEmail        string
	DemoFallback         bool
	RequestTimeout       time.Duration
	MaxMessageChars      int
	OpenClawSessionKey   string
	OpenClawAgentID      string
	OpenClawScopes       []string
	OpenClawHistoryLimit int
	Markets              map[string]market
}

type market struct {
	ID           string `json:"id"`
	Label        string `json:"label"`
	Enabled      bool   `json:"enabled"`
	LegalEntity  string `json:"legalEntity"`
	HandoffEmail string `json:"handoffEmail"`
}

type chatEvent struct {
	Source         string `json:"source"`
	ConversationID string `json:"conversationId"`
	MarketID       string `json:"marketId"`
	MarketLabel    string `json:"marketLabel"`
	LegalEntity    string `json:"legalEntity"`
	Intent         string `json:"intent"`
	Message        string `json:"message"`
	Page           string `json:"page"`
	Language       string `json:"language"`
	SentAt         string `json:"sentAt"`
}

type guardrails struct {
	NoOutboundMessaging bool   `json:"noOutboundMessaging"`
	PermissionFirst     bool   `json:"permissionFirst"`
	HumanHandoffEmail   string `json:"humanHandoffEmail"`
}

type agentPayload struct {
	chatEvent
	Market     *market    `json:"market,omitempty"`
	Guardrails guardrails `json:"guardrails"`
}

type agentResponse struct {
	Reply string `json:"reply"`
	Mode  string `json:"mode,omitempty"`
}

type chatResponse struct {
	Reply          string `json:"reply,omitempty"`
	Mode           string `json:"mode,omitempty"`
	ConversationID string `json:"conversationId,omitempty"`
	Error          string `json:"error,omitempty"`
}

type gatewayRequest struct {
	Type   string `json:"type"`
	ID     string `json:"id"`
	Method string `json:"method"`
	Params any    `json:"params"`
}

type gatewayResponse struct {
	Type    string          `json:"type"`
	ID      string          `json:"id"`
	OK      bool            `json:"ok"`
	Payload json.RawMessage `json:"payload"`
	Error   *gatewayError   `json:"error"`
}

type gatewayError struct {
	Code         string          `json:"code"`
	Message      string          `json:"message"`
	Details      json.RawMessage `json:"details,omitempty"`
	Retryable    bool            `json:"retryable,omitempty"`
	RetryAfterMs int             `json:"retryAfterMs,omitempty"`
}

type gatewayEvent struct {
	Type       string          `json:"type"`
	Event      string          `json:"event"`
	Payload    json.RawMessage `json:"payload"`
	Seq        int64           `json:"seq,omitempty"`
	RunID      string          `json:"runId,omitempty"`
	SessionKey string          `json:"sessionKey,omitempty"`
	State      string          `json:"state,omitempty"`
	Message    json.RawMessage `json:"message,omitempty"`
	DeltaText  string          `json:"deltaText,omitempty"`
}

type gatewayHistory struct {
	Messages []json.RawMessage `json:"messages"`
}

type openClawSendAck struct {
	RunID  string `json:"runId"`
	Status string `json:"status"`
}

type historySnapshot struct {
	Count           int
	LatestAssistant string
}

type server struct {
	cfg    config
	client *http.Client
	logger *log.Logger
}

func main() {
	cfg := loadConfig()
	srv := &server{
		cfg: cfg,
		client: &http.Client{
			Timeout: cfg.RequestTimeout,
		},
		logger: log.New(os.Stdout, "", log.LstdFlags),
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/healthz", srv.handleHealth)
	mux.HandleFunc("/api/chat", srv.handleChat)

	srv.logger.Printf(
		"chatbot api listening on :%s agent_configured=%t agent_transport=%q allowed_origin=%q demo_fallback=%t",
		cfg.Port,
		cfg.AgentURL != "",
		cfg.AgentTransport,
		cfg.AllowedOrigin,
		cfg.DemoFallback,
	)

	if err := http.ListenAndServe(":"+cfg.Port, mux); err != nil {
		srv.logger.Fatalf("server stopped: %v", err)
	}
}

func loadConfig() config {
	fallbackEmail := getEnv("CHAT_FALLBACK_EMAIL", "luis.ramirez@opencloud.es")
	agentURL := firstNonEmpty(os.Getenv("OPENCLAW_AGENT_URL"), os.Getenv("CHAT_AGENT_WEBHOOK_URL"))
	agentTransport := normalizeAgentTransport(getEnv("OPENCLAW_AGENT_TRANSPORT", ""), agentURL)

	return config{
		Port:                 getEnv("PORT", defaultPort),
		AllowedOrigin:        getEnv("CHAT_ALLOWED_ORIGIN", "*"),
		AgentTransport:       agentTransport,
		AgentURL:             agentURL,
		AgentToken:           firstNonEmpty(os.Getenv("OPENCLAW_AGENT_TOKEN"), os.Getenv("CHAT_AGENT_WEBHOOK_TOKEN")),
		FallbackEmail:        fallbackEmail,
		DemoFallback:         getEnvBool("CHAT_DEMO_FALLBACK", true),
		RequestTimeout:       time.Duration(getEnvInt("CHAT_AGENT_TIMEOUT_SECONDS", 15)) * time.Second,
		MaxMessageChars:      getEnvInt("CHAT_MAX_MESSAGE_CHARS", 2400),
		OpenClawSessionKey:   getEnv("OPENCLAW_SESSION_KEY", "main"),
		OpenClawAgentID:      getEnv("OPENCLAW_AGENT_ID", ""),
		OpenClawScopes:       getEnvList("OPENCLAW_SCOPES", []string{"operator.read", "operator.write"}),
		OpenClawHistoryLimit: getEnvInt("OPENCLAW_HISTORY_LIMIT", 30),
		Markets: map[string]market{
			"us": newMarket("SDM_CHATBOT_US", market{
				ID:           "us",
				Label:        "United States",
				Enabled:      true,
				LegalEntity:  "OPENCLOUD GLOBAL SERVICES, LLC",
				HandoffEmail: fallbackEmail,
			}),
			"spain": newMarket("SDM_CHATBOT_ES", market{
				ID:           "spain",
				Label:        "Spain / Europe",
				Enabled:      true,
				LegalEntity:  "OpenCloud AADD SL",
				HandoffEmail: fallbackEmail,
			}),
			"uae": newMarket("SDM_CHATBOT_AE", market{
				ID:           "uae",
				Label:        "UAE",
				Enabled:      false,
				LegalEntity:  "Pending UAE entity",
				HandoffEmail: fallbackEmail,
			}),
		},
	}
}

func newMarket(prefix string, defaults market) market {
	return market{
		ID:           defaults.ID,
		Label:        getEnv(prefix+"_LABEL", defaults.Label),
		Enabled:      getEnvBool(prefix+"_ENABLED", defaults.Enabled),
		LegalEntity:  getEnv(prefix+"_LEGAL_ENTITY", defaults.LegalEntity),
		HandoffEmail: getEnv(prefix+"_HANDOFF_EMAIL", defaults.HandoffEmail),
	}
}

func (s *server) handleHealth(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		s.writeJSON(w, r, http.StatusMethodNotAllowed, chatResponse{Error: "method not allowed"})
		return
	}

	s.writeJSON(w, r, http.StatusOK, map[string]any{
		"ok":              true,
		"agentConfigured": s.cfg.AgentURL != "",
	})
}

func (s *server) handleChat(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		s.writeNoContent(w, r, http.StatusNoContent)
		return
	}

	if r.Method != http.MethodPost {
		s.writeJSON(w, r, http.StatusMethodNotAllowed, chatResponse{Error: "method not allowed"})
		return
	}

	if !s.isOriginAllowed(r) {
		s.writeJSON(w, r, http.StatusForbidden, chatResponse{Error: "origin is not allowed"})
		return
	}

	var event chatEvent
	if err := readJSON(w, r, &event); err != nil {
		s.writeJSON(w, r, http.StatusBadRequest, chatResponse{Error: "invalid JSON body"})
		return
	}

	event.Message = strings.TrimSpace(event.Message)
	if err := s.validateEvent(event); err != nil {
		s.writeJSON(w, r, http.StatusBadRequest, chatResponse{Error: err.Error()})
		return
	}

	marketValue, ok := s.cfg.Markets[event.MarketID]
	var marketRef *market
	if ok {
		marketRef = &marketValue
	}

	if reply, err := s.callAgentWebhook(r.Context(), event, marketRef); err != nil {
		s.logger.Printf("agent webhook failed market=%q intent=%q conversation=%q err=%v", event.MarketID, event.Intent, event.ConversationID, err)
		if !s.cfg.DemoFallback {
			s.writeJSON(w, r, http.StatusBadGateway, chatResponse{Error: "chat agent is unavailable"})
			return
		}
	} else if reply != "" {
		s.writeJSON(w, r, http.StatusOK, chatResponse{
			Reply:          reply,
			Mode:           "agent",
			ConversationID: event.ConversationID,
		})
		return
	}

	if !s.cfg.DemoFallback {
		s.writeJSON(w, r, http.StatusServiceUnavailable, chatResponse{Error: "chat agent is not configured"})
		return
	}

	s.writeJSON(w, r, http.StatusOK, chatResponse{
		Reply:          s.buildFallbackReply(event, marketRef),
		Mode:           "fallback",
		ConversationID: event.ConversationID,
	})
}

func (s *server) validateEvent(event chatEvent) error {
	if event.Message == "" {
		return errors.New("message is required")
	}

	if len([]rune(event.Message)) > s.cfg.MaxMessageChars {
		return fmt.Errorf("message must be %d characters or fewer", s.cfg.MaxMessageChars)
	}

	return nil
}

func (s *server) callAgentWebhook(ctx context.Context, event chatEvent, marketRef *market) (string, error) {
	if s.cfg.AgentURL == "" {
		return "", nil
	}

	if s.cfg.AgentTransport == transportOpenClawGateway {
		return s.callOpenClawGateway(ctx, event, marketRef)
	}

	handoffEmail := s.cfg.FallbackEmail
	if marketRef != nil && marketRef.HandoffEmail != "" {
		handoffEmail = marketRef.HandoffEmail
	}

	payload := agentPayload{
		chatEvent: event,
		Market:    marketRef,
		Guardrails: guardrails{
			NoOutboundMessaging: true,
			PermissionFirst:     true,
			HumanHandoffEmail:   handoffEmail,
		},
	}

	body, err := json.Marshal(payload)
	if err != nil {
		return "", err
	}

	request, err := http.NewRequestWithContext(ctx, http.MethodPost, s.cfg.AgentURL, bytes.NewReader(body))
	if err != nil {
		return "", err
	}

	request.Header.Set("content-type", "application/json")
	request.Header.Set("accept", "application/json")
	request.Header.Set("user-agent", "smartdigitalminds-chatbot/1.0")
	if s.cfg.AgentToken != "" {
		request.Header.Set("authorization", "Bearer "+s.cfg.AgentToken)
	}
	if event.ConversationID != "" {
		request.Header.Set("x-sdm-conversation-id", event.ConversationID)
	}

	response, err := s.client.Do(request)
	if err != nil {
		return "", err
	}
	defer response.Body.Close()

	if response.StatusCode < http.StatusOK || response.StatusCode >= http.StatusMultipleChoices {
		io.Copy(io.Discard, io.LimitReader(response.Body, 2048))
		return "", fmt.Errorf("agent webhook returned HTTP %d", response.StatusCode)
	}

	var agentResult agentResponse
	if err := json.NewDecoder(io.LimitReader(response.Body, 1<<20)).Decode(&agentResult); err != nil {
		return "", err
	}

	return strings.TrimSpace(agentResult.Reply), nil
}

func (s *server) callOpenClawGateway(ctx context.Context, event chatEvent, marketRef *market) (string, error) {
	ctx, cancel := context.WithTimeout(ctx, s.cfg.RequestTimeout)
	defer cancel()

	wsURL, err := normalizeWebSocketURL(s.cfg.AgentURL)
	if err != nil {
		return "", err
	}

	headers := http.Header{}
	headers.Set("user-agent", "smartdigitalminds-chatbot/1.0")
	if origin := getEnv("OPENCLAW_ORIGIN", originFromURL(s.cfg.AgentURL)); origin != "" {
		headers.Set("origin", origin)
	}
	if s.cfg.AgentToken != "" {
		headers.Set("authorization", "Bearer "+s.cfg.AgentToken)
	}

	dialer := websocket.Dialer{
		HandshakeTimeout: minDuration(5*time.Second, s.cfg.RequestTimeout),
	}
	conn, response, err := dialer.DialContext(ctx, wsURL, headers)
	if err != nil {
		if response != nil {
			return "", fmt.Errorf("openclaw gateway websocket failed with HTTP %d: %w", response.StatusCode, err)
		}
		return "", err
	}
	defer conn.Close()
	conn.SetReadLimit(1 << 20)

	nonce, err := s.readOpenClawChallenge(ctx, conn)
	if err != nil {
		return "", err
	}

	if _, err := s.openClawGatewayRequest(ctx, conn, "connect", s.buildOpenClawConnectParams(nonce)); err != nil {
		return "", err
	}

	before, _ := s.openClawHistorySnapshot(ctx, conn)
	runID := randomID("sdm-run")
	sendParams := map[string]any{
		"sessionKey":     s.cfg.OpenClawSessionKey,
		"message":        s.buildOpenClawMessage(event, marketRef),
		"deliver":        false,
		"idempotencyKey": runID,
	}
	if s.cfg.OpenClawAgentID != "" {
		sendParams["agentId"] = s.cfg.OpenClawAgentID
	}

	sendPayload, err := s.openClawGatewayRequest(ctx, conn, "chat.send", sendParams)
	if err != nil {
		return "", err
	}

	var ack openClawSendAck
	if len(sendPayload) > 0 {
		_ = json.Unmarshal(sendPayload, &ack)
	}
	if ack.RunID == "" {
		ack.RunID = runID
	}

	reply, err := s.waitForOpenClawReply(ctx, conn, before)
	if err != nil {
		return "", fmt.Errorf("openclaw run %s did not produce a reply: %w", ack.RunID, err)
	}

	return reply, nil
}

func (s *server) readOpenClawChallenge(ctx context.Context, conn *websocket.Conn) (string, error) {
	deadline := time.Now().Add(minDuration(750*time.Millisecond, s.cfg.RequestTimeout))
	conn.SetReadDeadline(deadline)
	defer conn.SetReadDeadline(time.Time{})

	for {
		_, data, err := conn.ReadMessage()
		if err != nil {
			if isTimeoutError(err) {
				return "", nil
			}
			return "", err
		}

		var event gatewayEvent
		if err := json.Unmarshal(data, &event); err != nil {
			continue
		}
		if event.Type != "event" || event.Event != "connect.challenge" {
			continue
		}

		var payload struct {
			Nonce string `json:"nonce"`
		}
		if err := json.Unmarshal(event.Payload, &payload); err != nil {
			return "", err
		}
		return payload.Nonce, nil
	}
}

func (s *server) buildOpenClawConnectParams(nonce string) map[string]any {
	clientID := getEnv("OPENCLAW_CLIENT_ID", "openclaw-control-ui")
	clientMode := getEnv("OPENCLAW_CLIENT_MODE", "webchat")
	role := getEnv("OPENCLAW_ROLE", "operator")
	device, err := buildOpenClawDeviceAuth(clientID, clientMode, role, s.cfg.OpenClawScopes, s.cfg.AgentToken, nonce)
	if err != nil {
		s.logger.Printf("openclaw device auth disabled: %v", err)
	}

	params := map[string]any{
		"minProtocol": 4,
		"maxProtocol": 4,
		"client": map[string]any{
			"id":         clientID,
			"version":    "smartdigitalminds-chatbot/1.0",
			"platform":   "server",
			"mode":       clientMode,
			"instanceId": randomID("sdm-backend"),
		},
		"role":      role,
		"scopes":    s.cfg.OpenClawScopes,
		"caps":      []string{"tool-events"},
		"userAgent": "smartdigitalminds-chatbot/1.0",
		"locale":    "en-US",
	}
	if s.cfg.AgentToken != "" {
		params["auth"] = map[string]string{"token": s.cfg.AgentToken}
	}
	if device != nil {
		params["device"] = device
	}

	return params
}

func (s *server) openClawGatewayRequest(ctx context.Context, conn *websocket.Conn, method string, params any) (json.RawMessage, error) {
	id := randomID("sdm-req")
	request := gatewayRequest{
		Type:   "req",
		ID:     id,
		Method: method,
		Params: params,
	}

	if err := writeGatewayJSON(ctx, conn, request); err != nil {
		return nil, err
	}

	for {
		data, err := readGatewayJSON(ctx, conn)
		if err != nil {
			return nil, err
		}

		var response gatewayResponse
		if err := json.Unmarshal(data, &response); err != nil || response.Type != "res" || response.ID != id {
			continue
		}

		if response.OK {
			return response.Payload, nil
		}
		if response.Error == nil {
			return nil, fmt.Errorf("openclaw gateway request %s failed", method)
		}
		return nil, fmt.Errorf("openclaw gateway request %s failed: %s %s", method, response.Error.Code, response.Error.Message)
	}
}

func (s *server) openClawHistorySnapshot(ctx context.Context, conn *websocket.Conn) (historySnapshot, error) {
	params := map[string]any{
		"sessionKey": s.cfg.OpenClawSessionKey,
		"limit":      s.cfg.OpenClawHistoryLimit,
	}
	if s.cfg.OpenClawAgentID != "" {
		params["agentId"] = s.cfg.OpenClawAgentID
	}

	payload, err := s.openClawGatewayRequest(ctx, conn, "chat.history", params)
	if err != nil {
		return historySnapshot{}, err
	}

	var history gatewayHistory
	if err := json.Unmarshal(payload, &history); err != nil {
		return historySnapshot{}, err
	}

	snapshot := historySnapshot{Count: len(history.Messages)}
	for i := len(history.Messages) - 1; i >= 0; i-- {
		if reply := extractAssistantText(history.Messages[i]); reply != "" {
			snapshot.LatestAssistant = reply
			break
		}
	}

	return snapshot, nil
}

func (s *server) waitForOpenClawReply(ctx context.Context, conn *websocket.Conn, before historySnapshot) (string, error) {
	ticker := time.NewTicker(850 * time.Millisecond)
	defer ticker.Stop()

	for {
		snapshot, err := s.openClawHistorySnapshot(ctx, conn)
		if err == nil && snapshot.LatestAssistant != "" && (snapshot.Count > before.Count || snapshot.LatestAssistant != before.LatestAssistant) {
			return snapshot.LatestAssistant, nil
		}

		select {
		case <-ctx.Done():
			return "", ctx.Err()
		case <-ticker.C:
		}
	}
}

func (s *server) buildOpenClawMessage(event chatEvent, marketRef *market) string {
	handoffEmail := s.cfg.FallbackEmail
	if marketRef != nil && marketRef.HandoffEmail != "" {
		handoffEmail = marketRef.HandoffEmail
	}

	marketLabel := strings.TrimSpace(event.MarketLabel)
	if marketLabel == "" && marketRef != nil {
		marketLabel = marketRef.Label
	}

	lines := []string{
		"Website chat request from smartdigitalminds.com.",
		"Reply in the user's language and keep the answer concise.",
		"Do not send outbound messages or imply that any outreach has been sent.",
		"Use permission-first guidance and offer human handoff when useful.",
		"",
		"Context:",
		"- Market: " + marketLabel,
		"- Intent: " + strings.TrimSpace(event.Intent),
		"- Language: " + strings.TrimSpace(event.Language),
		"- Human handoff email: " + handoffEmail,
		"",
		"User message:",
		event.Message,
	}

	return strings.Join(lines, "\n")
}

func (s *server) buildFallbackReply(event chatEvent, marketRef *market) string {
	language := normalizeReplyLanguage(event.Language)
	marketLabel := strings.TrimSpace(event.MarketLabel)
	if marketLabel == "" && marketRef != nil {
		marketLabel = marketRef.Label
	}
	if marketLabel == "" {
		marketLabel = fallbackMarketLabel(language)
	}

	handoffEmail := s.cfg.FallbackEmail
	if marketRef != nil && marketRef.HandoffEmail != "" {
		handoffEmail = marketRef.HandoffEmail
	}

	if marketRef != nil && !marketRef.Enabled {
		return disabledMarketReply(language, marketLabel, handoffEmail)
	}

	return fallbackReply(language, marketLabel, intentLabel(language, event.Intent), handoffEmail)
}

func readJSON(w http.ResponseWriter, r *http.Request, target any) error {
	defer r.Body.Close()
	limitedBody := http.MaxBytesReader(w, r.Body, 1<<20)
	decoder := json.NewDecoder(limitedBody)
	return decoder.Decode(target)
}

func (s *server) isOriginAllowed(r *http.Request) bool {
	origin := r.Header.Get("origin")
	if origin == "" || s.cfg.AllowedOrigin == "*" {
		return true
	}

	return origin == s.cfg.AllowedOrigin
}

func (s *server) writeNoContent(w http.ResponseWriter, r *http.Request, status int) {
	s.setCORSHeaders(w, r)
	w.WriteHeader(status)
}

func (s *server) writeJSON(w http.ResponseWriter, r *http.Request, status int, payload any) {
	s.setCORSHeaders(w, r)
	w.Header().Set("content-type", "application/json")
	w.WriteHeader(status)
	if payload != nil {
		json.NewEncoder(w).Encode(payload)
	}
}

func (s *server) setCORSHeaders(w http.ResponseWriter, r *http.Request) {
	origin := r.Header.Get("origin")
	if s.cfg.AllowedOrigin == "*" {
		w.Header().Set("access-control-allow-origin", "*")
	} else if origin == s.cfg.AllowedOrigin {
		w.Header().Set("access-control-allow-origin", origin)
		w.Header().Set("vary", "origin")
	}

	w.Header().Set("access-control-allow-methods", "POST, OPTIONS")
	w.Header().Set("access-control-allow-headers", "content-type")
}

func normalizeReplyLanguage(language string) string {
	language = strings.ToLower(strings.TrimSpace(language))
	if language == "" {
		return "en"
	}

	base, _, _ := strings.Cut(strings.ReplaceAll(language, "_", "-"), "-")
	switch base {
	case "en", "es", "pt", "fr", "de", "it":
		return base
	default:
		return "en"
	}
}

func intentLabel(language string, intent string) string {
	labels := map[string]map[string]string{
		"en": {
			"agent-audit":   "agent audit",
			"lead-followup": "lead follow-up workflow",
			"operations":    "operations automation",
			"whatsapp":      "WhatsApp integration",
		},
		"es": {
			"agent-audit":   "auditoría de agentes",
			"lead-followup": "seguimiento de contactos",
			"operations":    "automatización operativa",
			"whatsapp":      "integración con WhatsApp",
		},
		"pt": {
			"agent-audit":   "auditoria de agentes",
			"lead-followup": "seguimento de contactos",
			"operations":    "automatização operativa",
			"whatsapp":      "integração com WhatsApp",
		},
		"fr": {
			"agent-audit":   "audit d'agents",
			"lead-followup": "suivi des prospects",
			"operations":    "automatisation des opérations",
			"whatsapp":      "intégration WhatsApp",
		},
		"de": {
			"agent-audit":   "Agenten-Audit",
			"lead-followup": "Lead-Follow-up",
			"operations":    "Betriebsautomatisierung",
			"whatsapp":      "WhatsApp-Integration",
		},
		"it": {
			"agent-audit":   "audit agenti",
			"lead-followup": "follow-up lead",
			"operations":    "automazione operativa",
			"whatsapp":      "integrazione WhatsApp",
		},
	}

	if label := labels[language][intent]; label != "" {
		return label
	}

	return strings.ReplaceAll(intent, "-", " ")
}

func fallbackMarketLabel(language string) string {
	switch language {
	case "es":
		return "el mercado seleccionado"
	case "pt":
		return "o mercado selecionado"
	case "fr":
		return "le marché sélectionné"
	case "de":
		return "der ausgewählte Markt"
	case "it":
		return "il mercato selezionato"
	default:
		return "the selected market"
	}
}

func fallbackReply(language string, marketLabel string, topic string, email string) string {
	switch language {
	case "es":
		return fmt.Sprintf("Gracias. Para %s, lo plantearía como %s: proceso actual, volumen, retraso, responsable y valor estimado. Escribe a %s si quieres que el equipo lo revise.", marketLabel, topic, email)
	case "pt":
		return fmt.Sprintf("Obrigado. Para %s, eu enquadraria isto como %s: processo atual, volume, atraso, responsável e valor estimado. Escreva para %s se quiser que a equipa o reveja.", marketLabel, topic, email)
	case "fr":
		return fmt.Sprintf("Merci. Pour %s, je cadrerais cela comme %s : flux actuel, volume, délai, responsable et valeur estimée. Écrivez à %s si vous souhaitez que l'équipe l'examine.", marketLabel, topic, email)
	case "de":
		return fmt.Sprintf("Danke. Für %s würde ich das als %s einordnen: aktueller Ablauf, Volumen, Verzögerung, Verantwortliche und geschätzter Wert. Schreiben Sie an %s, wenn das Team es prüfen soll.", marketLabel, topic, email)
	case "it":
		return fmt.Sprintf("Grazie. Per %s lo inquadrerei come %s: flusso attuale, volume, ritardo, responsabile e valore stimato. Scrivi a %s se vuoi che il team lo esamini.", marketLabel, topic, email)
	default:
		return fmt.Sprintf("Thanks. For %s, I would scope this as a %s: current workflow, volume, delay, owner, and estimated value. Email %s if you want the team to review it.", marketLabel, topic, email)
	}
}

func disabledMarketReply(language string, marketLabel string, email string) string {
	switch language {
	case "es":
		return fmt.Sprintf("La ruta de chat para %s está preparada, pero aún no está activada. Escribe a %s con el proceso y el mercado para revisarlo antes de activarla.", marketLabel, email)
	case "pt":
		return fmt.Sprintf("O caminho de chat para %s está preparado, mas ainda não está ativo. Escreva para %s com o processo e o mercado para revisão antes da ativação.", marketLabel, email)
	case "fr":
		return fmt.Sprintf("Le parcours de chat pour %s est prêt, mais pas encore activé. Écrivez à %s avec le flux et le marché afin qu'il soit examiné avant activation.", marketLabel, email)
	case "de":
		return fmt.Sprintf("Der Chat-Pfad für %s ist vorbereitet, aber noch nicht aktiviert. Schreiben Sie an %s mit Ablauf und Markt, damit er vor der Aktivierung geprüft werden kann.", marketLabel, email)
	case "it":
		return fmt.Sprintf("Il percorso chat per %s è pronto, ma non ancora attivo. Scrivi a %s con il flusso e il mercato così può essere esaminato prima dell'attivazione.", marketLabel, email)
	default:
		return fmt.Sprintf("The %s chat path is prepared but not enabled yet. Please email %s with the workflow and market so it can be reviewed before activation.", marketLabel, email)
	}
}

func normalizeAgentTransport(value string, agentURL string) string {
	value = strings.ToLower(strings.TrimSpace(value))
	switch value {
	case "", "http", "webhook":
		if strings.HasPrefix(strings.ToLower(strings.TrimSpace(agentURL)), "ws://") || strings.HasPrefix(strings.ToLower(strings.TrimSpace(agentURL)), "wss://") {
			return transportOpenClawGateway
		}
		return transportWebhook
	case "openclaw", "openclaw_gateway", "openclaw-gateway", "gateway", "websocket", "ws":
		return transportOpenClawGateway
	default:
		return transportWebhook
	}
}

func normalizeWebSocketURL(rawURL string) (string, error) {
	parsed, err := url.Parse(strings.TrimSpace(rawURL))
	if err != nil {
		return "", err
	}

	switch parsed.Scheme {
	case "http":
		parsed.Scheme = "ws"
	case "https":
		parsed.Scheme = "wss"
	case "ws", "wss":
	default:
		return "", fmt.Errorf("openclaw gateway URL must use http, https, ws, or wss")
	}

	if parsed.Host == "" {
		return "", fmt.Errorf("openclaw gateway URL must include a host")
	}
	if parsed.Path == "" {
		parsed.Path = "/"
	}

	return parsed.String(), nil
}

func originFromURL(rawURL string) string {
	parsed, err := url.Parse(strings.TrimSpace(rawURL))
	if err != nil || parsed.Host == "" {
		return ""
	}

	switch parsed.Scheme {
	case "ws", "http":
		return "http://" + parsed.Host
	case "wss", "https":
		return "https://" + parsed.Host
	default:
		return ""
	}
}

func buildOpenClawDeviceAuth(clientID string, clientMode string, role string, scopes []string, token string, nonce string) (map[string]any, error) {
	publicKey, privateKey, err := ed25519.GenerateKey(rand.Reader)
	if err != nil {
		return nil, err
	}

	deviceHash := sha256.Sum256(publicKey)
	deviceID := hex.EncodeToString(deviceHash[:])
	signedAt := time.Now().UnixNano() / int64(time.Millisecond)
	signingInput := strings.Join([]string{
		"v2",
		deviceID,
		clientID,
		clientMode,
		role,
		strings.Join(scopes, ","),
		strconv.FormatInt(signedAt, 10),
		token,
		nonce,
	}, "|")
	signature := ed25519.Sign(privateKey, []byte(signingInput))

	return map[string]any{
		"id":        deviceID,
		"publicKey": base64.RawURLEncoding.EncodeToString(publicKey),
		"signature": base64.RawURLEncoding.EncodeToString(signature),
		"signedAt":  signedAt,
		"nonce":     nonce,
	}, nil
}

func writeGatewayJSON(ctx context.Context, conn *websocket.Conn, payload any) error {
	deadline := deadlineFromContext(ctx, 10*time.Second)
	if err := conn.SetWriteDeadline(deadline); err != nil {
		return err
	}
	if err := conn.WriteJSON(payload); err != nil {
		if ctx.Err() != nil {
			return ctx.Err()
		}
		return err
	}
	return nil
}

func readGatewayJSON(ctx context.Context, conn *websocket.Conn) ([]byte, error) {
	deadline := deadlineFromContext(ctx, 30*time.Second)
	if err := conn.SetReadDeadline(deadline); err != nil {
		return nil, err
	}

	_, data, err := conn.ReadMessage()
	if err != nil {
		if ctx.Err() != nil {
			return nil, ctx.Err()
		}
		return nil, err
	}

	return data, nil
}

func deadlineFromContext(ctx context.Context, fallback time.Duration) time.Time {
	if deadline, ok := ctx.Deadline(); ok {
		return deadline
	}
	return time.Now().Add(fallback)
}

func isTimeoutError(err error) bool {
	var netError net.Error
	return errors.As(err, &netError) && netError.Timeout()
}

func minDuration(left time.Duration, right time.Duration) time.Duration {
	if left <= 0 {
		return right
	}
	if right <= 0 || left < right {
		return left
	}
	return right
}

func extractAssistantText(raw json.RawMessage) string {
	var message struct {
		Role    string          `json:"role"`
		Text    string          `json:"text"`
		Content json.RawMessage `json:"content"`
	}
	if err := json.Unmarshal(raw, &message); err != nil {
		return ""
	}
	if strings.ToLower(strings.TrimSpace(message.Role)) != "assistant" {
		return ""
	}
	if text := strings.TrimSpace(message.Text); text != "" {
		return text
	}
	if len(message.Content) == 0 {
		return ""
	}

	return strings.TrimSpace(extractTextFromJSON(message.Content))
}

func extractTextFromJSON(raw json.RawMessage) string {
	var value any
	if err := json.Unmarshal(raw, &value); err != nil {
		return ""
	}
	return extractText(value)
}

func extractText(value any) string {
	switch typed := value.(type) {
	case string:
		return typed
	case []any:
		parts := make([]string, 0, len(typed))
		for _, item := range typed {
			if text := strings.TrimSpace(extractText(item)); text != "" {
				parts = append(parts, text)
			}
		}
		return strings.Join(parts, "\n")
	case map[string]any:
		if text, ok := typed["text"].(string); ok {
			return text
		}
		if content, ok := typed["content"]; ok {
			return extractText(content)
		}
		if message, ok := typed["message"]; ok {
			return extractText(message)
		}
	}
	return ""
}

func randomID(prefix string) string {
	var bytes [16]byte
	if _, err := rand.Read(bytes[:]); err != nil {
		return fmt.Sprintf("%s-%d", prefix, time.Now().UnixNano())
	}
	return prefix + "-" + hex.EncodeToString(bytes[:])
}

func getEnv(key string, fallback string) string {
	if value := strings.TrimSpace(os.Getenv(key)); value != "" {
		return value
	}

	return fallback
}

func getEnvList(key string, fallback []string) []string {
	value := strings.TrimSpace(os.Getenv(key))
	if value == "" {
		return fallback
	}

	parts := strings.Split(value, ",")
	values := make([]string, 0, len(parts))
	for _, part := range parts {
		if item := strings.TrimSpace(part); item != "" {
			values = append(values, item)
		}
	}
	if len(values) == 0 {
		return fallback
	}

	return values
}

func getEnvBool(key string, fallback bool) bool {
	value := strings.ToLower(strings.TrimSpace(os.Getenv(key)))
	if value == "" {
		return fallback
	}

	switch value {
	case "1", "true", "yes", "y", "on":
		return true
	case "0", "false", "no", "n", "off":
		return false
	default:
		return fallback
	}
}

func getEnvInt(key string, fallback int) int {
	value := strings.TrimSpace(os.Getenv(key))
	if value == "" {
		return fallback
	}

	parsed, err := strconv.Atoi(value)
	if err != nil || parsed <= 0 {
		return fallback
	}

	return parsed
}

func firstNonEmpty(values ...string) string {
	for _, value := range values {
		if strings.TrimSpace(value) != "" {
			return strings.TrimSpace(value)
		}
	}

	return ""
}
