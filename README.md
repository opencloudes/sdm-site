# WhatsApp Integration

This folder keeps server-side messaging and chat setup separate from the static website.

## Market Variables

Use `whatsapp.env.example` as the deployment template. Each market has its own:

- WhatsApp Business Account ID
- Phone number ID
- Public E.164 phone number
- Template prefix

Markets currently prepared:

- `US`
- `Spain / Europe`
- `UAE`

## Website Variables

The static website reads `../whatsapp.config.js`.

Fill `phoneNumberE164` when a market number is ready. Until then, the page shows that the market is pending instead of linking to WhatsApp.

Do not put Meta access tokens in `whatsapp.config.js`.

## Backend Webhook

`whatsapp-webhook.example.js` shows the server-side shape:

- Verifies Meta's webhook challenge.
- Receives WhatsApp messages.
- Routes the event to the right market by `phone_number_id`.
- Forwards normalized events to `AGENT_WEBHOOK_URL`.
- Exposes a reusable `sendWhatsAppText` helper for session replies.

Outbound promotional or template messages should remain disabled until opt-in, templates, legal identity, and market readiness are approved.

## Website Chatbot

Use `../backend/chatbot` for the deployable Go backend and Docker container. `chatbot-api.example.js` remains only as a lightweight reference for the original request shape.

The chatbot API:

- Receives website chat messages at `/api/chat`.
- Routes by market: `us`, `spain`, or `uae`.
- Forwards the normalized event to `OPENCLAW_AGENT_URL` or `CHAT_AGENT_WEBHOOK_URL` when configured.
- Adds guardrails for no outbound messaging and permission-first handling.
- Returns a fallback reply when the real agent webhook is not configured.

The static website reads `chatbot.config.js`. Put only public values there. Keep agent URLs, tokens, and provider credentials in the backend container environment.
