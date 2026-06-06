import http from "node:http";

const PORT = Number(process.env.PORT || 8787);
const GRAPH_VERSION = process.env.META_GRAPH_VERSION || "vXX.X";
const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN || "";
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "";
const AGENT_WEBHOOK_URL = process.env.AGENT_WEBHOOK_URL || "";

const markets = [
  {
    id: "us",
    label: "United States",
    wabaId: process.env.SDM_WHATSAPP_US_WABA_ID || "",
    phoneNumberId: process.env.SDM_WHATSAPP_US_PHONE_NUMBER_ID || "",
    phoneNumberE164: process.env.SDM_WHATSAPP_US_PHONE_E164 || "",
    templatePrefix: process.env.SDM_WHATSAPP_US_TEMPLATE_PREFIX || "sdm_us"
  },
  {
    id: "spain",
    label: "Spain / Europe",
    wabaId: process.env.SDM_WHATSAPP_ES_WABA_ID || "",
    phoneNumberId: process.env.SDM_WHATSAPP_ES_PHONE_NUMBER_ID || "",
    phoneNumberE164: process.env.SDM_WHATSAPP_ES_PHONE_E164 || "",
    templatePrefix: process.env.SDM_WHATSAPP_ES_TEMPLATE_PREFIX || "sdm_es"
  },
  {
    id: "uae",
    label: "UAE",
    wabaId: process.env.SDM_WHATSAPP_AE_WABA_ID || "",
    phoneNumberId: process.env.SDM_WHATSAPP_AE_PHONE_NUMBER_ID || "",
    phoneNumberE164: process.env.SDM_WHATSAPP_AE_PHONE_E164 || "",
    templatePrefix: process.env.SDM_WHATSAPP_AE_TEMPLATE_PREFIX || "sdm_ae"
  }
];

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

function sendJson(response, status, payload) {
  response.writeHead(status, { "content-type": "application/json" });
  response.end(JSON.stringify(payload));
}

function getMarketByPhoneNumberId(phoneNumberId) {
  return markets.find((market) => market.phoneNumberId && market.phoneNumberId === phoneNumberId) || null;
}

function normalizeMessage(change) {
  const value = change?.value || {};
  const metadata = value.metadata || {};
  const message = value.messages?.[0];
  const contact = value.contacts?.[0];
  const market = getMarketByPhoneNumberId(metadata.phone_number_id);

  if (!message) return null;

  return {
    source: "whatsapp",
    marketId: market?.id || "unknown",
    marketLabel: market?.label || "Unknown market",
    phoneNumberId: metadata.phone_number_id || "",
    businessDisplayNumber: metadata.display_phone_number || "",
    from: message.from,
    contactName: contact?.profile?.name || "",
    messageId: message.id,
    messageType: message.type,
    text: message.text?.body || "",
    timestamp: message.timestamp,
    receivedAt: new Date().toISOString()
  };
}

async function forwardToAgent(event) {
  if (!AGENT_WEBHOOK_URL) return { skipped: true };

  const response = await fetch(AGENT_WEBHOOK_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(event)
  });

  return {
    status: response.status,
    ok: response.ok
  };
}

export async function sendWhatsAppText({ marketId, to, text }) {
  const market = markets.find((entry) => entry.id === marketId);
  if (!market?.phoneNumberId) {
    throw new Error(`WhatsApp phone number ID missing for market: ${marketId}`);
  }
  if (!ACCESS_TOKEN) {
    throw new Error("META_ACCESS_TOKEN is required");
  }

  const response = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${market.phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${ACCESS_TOKEN}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to,
      type: "text",
      text: {
        preview_url: false,
        body: text
      }
    })
  });

  if (!response.ok) {
    throw new Error(`WhatsApp send failed: ${response.status} ${await response.text()}`);
  }

  return response.json();
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);

  if (request.method === "GET" && url.pathname === "/webhook/whatsapp") {
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");

    if (mode === "subscribe" && token && token === VERIFY_TOKEN) {
      response.writeHead(200, { "content-type": "text/plain" });
      response.end(challenge || "");
      return;
    }

    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  if (request.method === "POST" && url.pathname === "/webhook/whatsapp") {
    try {
      const payload = await readJson(request);
      const events = [];

      for (const entry of payload.entry || []) {
        for (const change of entry.changes || []) {
          const event = normalizeMessage(change);
          if (event) {
            events.push(event);
            await forwardToAgent(event);
          }
        }
      }

      sendJson(response, 200, { received: true, events: events.length });
    } catch (error) {
      sendJson(response, 400, { error: error.message });
    }
    return;
  }

  sendJson(response, 404, { error: "Not found" });
});

server.listen(PORT, () => {
  console.log(`WhatsApp webhook example listening on :${PORT}`);
});
