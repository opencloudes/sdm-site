import http from "node:http";

const PORT = Number(process.env.PORT || 8790);
const ALLOWED_ORIGIN = process.env.CHAT_ALLOWED_ORIGIN || "*";
const AGENT_WEBHOOK_URL = process.env.CHAT_AGENT_WEBHOOK_URL || "";
const FALLBACK_EMAIL = process.env.CHAT_FALLBACK_EMAIL || "agents@smartdigitalminds.com";
const DEMO_FALLBACK = process.env.CHAT_DEMO_FALLBACK !== "false";

const markets = {
  global: {
    id: "global",
    label: process.env.SDM_CHATBOT_GLOBAL_LABEL || "Global",
    enabled: process.env.SDM_CHATBOT_GLOBAL_ENABLED !== "false",
    legalEntity: process.env.SDM_CHATBOT_GLOBAL_LEGAL_ENTITY || "SmartDigitalMinds",
    handoffEmail: process.env.SDM_CHATBOT_GLOBAL_HANDOFF_EMAIL || FALLBACK_EMAIL
  },
  us: {
    id: "us",
    label: "United States",
    enabled: process.env.SDM_CHATBOT_US_ENABLED !== "false",
    legalEntity: process.env.SDM_CHATBOT_US_LEGAL_ENTITY || "OPENCLOUD GLOBAL SERVICES, LLC",
    handoffEmail: process.env.SDM_CHATBOT_US_HANDOFF_EMAIL || FALLBACK_EMAIL
  },
  spain: {
    id: "spain",
    label: "Spain / Europe",
    enabled: process.env.SDM_CHATBOT_ES_ENABLED !== "false",
    legalEntity: process.env.SDM_CHATBOT_ES_LEGAL_ENTITY || "OpenCloud AADD SL",
    handoffEmail: process.env.SDM_CHATBOT_ES_HANDOFF_EMAIL || FALLBACK_EMAIL
  },
  uae: {
    id: "uae",
    label: "UAE",
    enabled: process.env.SDM_CHATBOT_AE_ENABLED === "true",
    legalEntity: process.env.SDM_CHATBOT_AE_LEGAL_ENTITY || "Pending UAE entity",
    handoffEmail: process.env.SDM_CHATBOT_AE_HANDOFF_EMAIL || FALLBACK_EMAIL
  }
};

function readJson(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
    });
    request.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
  });
}

function writeJson(response, status, payload) {
  response.writeHead(status, {
    "access-control-allow-origin": ALLOWED_ORIGIN,
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "content-type",
    "content-type": "application/json"
  });
  response.end(JSON.stringify(payload));
}

function buildFallbackReply(event, market) {
  const marketLabel = market?.label || event.marketLabel || "the selected market";
  const topic = String(event.intent || "agent audit").replace(/-/g, " ");

  if (market && !market.enabled) {
    return `The ${marketLabel} chat path is prepared but not enabled yet. Please email ${market.handoffEmail} with the workflow and market so it can be reviewed before activation.`;
  }

  return `Thanks. For ${marketLabel}, I would scope this as a ${topic}: current workflow, volume, delay, owner, and estimated value. Email ${market?.handoffEmail || FALLBACK_EMAIL} if you want the team to review it.`;
}

async function callAgentWebhook(event, market) {
  if (!AGENT_WEBHOOK_URL) return null;

  const response = await fetch(AGENT_WEBHOOK_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      ...event,
      market,
      guardrails: {
        noOutboundMessaging: true,
        permissionFirst: true,
        humanHandoffEmail: market?.handoffEmail || FALLBACK_EMAIL
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Agent webhook not available right now. Try again or provide this info to agents@smartdigitalminds.com ${response.status}`);
  }

  return response.json();
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);

  if (request.method === "OPTIONS") {
    writeJson(response, 204, {});
    return;
  }

  if (request.method !== "POST" || url.pathname !== "/api/chat") {
    writeJson(response, 404, { error: "Not found" });
    return;
  }

  try {
    const event = await readJson(request);
    const market = markets[event.marketId] || null;

    if (!event.message || typeof event.message !== "string") {
      writeJson(response, 400, { error: "Message is required" });
      return;
    }

    const agentResult = await callAgentWebhook(event, market);
    if (agentResult?.reply) {
      writeJson(response, 200, {
        reply: agentResult.reply,
        mode: "agent",
        conversationId: event.conversationId
      });
      return;
    }

    if (!DEMO_FALLBACK) {
      writeJson(response, 503, { error: "Chat agent is not available right now" });
      return;
    }

    writeJson(response, 200, {
      reply: buildFallbackReply(event, market),
      mode: "fallback",
      conversationId: event.conversationId
    });
  } catch (error) {
    writeJson(response, 500, { error: error.message });
  }
});

server.listen(PORT, () => {
  console.log(`Chatbot API example listening on :${PORT}`);
});
