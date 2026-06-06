const focusMessages = {
  leads: "First win: reduce missed-call delay and recover inquiries that usually disappear.",
  ops: "First win: remove repeated admin steps and give the team a clear escalation path.",
  insight: "First win: turn daily activity into a weekly decision view managers can act on."
};

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

const chatState = {
  conversationId: `sdm-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
  isSending: false
};

function cleanWhatsAppNumber(phoneNumber) {
  return String(phoneNumber || "").replace(/[^\d]/g, "");
}

function isWhatsAppMarketReady(market) {
  return cleanWhatsAppNumber(market.phoneNumberE164).length >= 8;
}

function buildWhatsAppUrl(market, fallbackMessage) {
  const phone = cleanWhatsAppNumber(market.phoneNumberE164);
  const message = encodeURIComponent(market.message || fallbackMessage);
  return `https://wa.me/${phone}?text=${message}`;
}

function updateFocus(event) {
  const selected = event.target.closest("[data-focus]");
  if (!selected) return;

  const strip = selected.closest(".focus-strip");
  const result = strip.querySelector("[data-focus-result]");

  strip.querySelectorAll("[data-focus]").forEach((button) => {
    const isActive = button === selected;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  result.textContent = focusMessages[selected.dataset.focus];
}

function updateCalculator(form) {
  const data = new FormData(form);
  const hours = Number(data.get("hours"));
  const rate = Number(data.get("rate"));
  const leads = Number(data.get("leads"));
  const leadValue = Number(data.get("leadValue"));
  const monthlyHoursValue = hours * rate * 4;
  const recoveredLeadValue = leads * leadValue;
  const total = monthlyHoursValue + recoveredLeadValue;

  form.querySelector('[data-output="hours"]').textContent = String(hours);
  form.querySelector('[data-output="rate"]').textContent = formatter.format(rate);
  form.querySelector('[data-output="leads"]').textContent = String(leads);
  form.querySelector('[data-output="leadValue"]').textContent = formatter.format(leadValue);
  form.querySelector("[data-total]").textContent = formatter.format(total);
}

function renderWhatsAppMarkets() {
  const mount = document.querySelector("[data-whatsapp-markets]");
  const config = window.SDM_WHATSAPP_CONFIG;
  if (!mount || !config?.markets?.length) return;

  mount.innerHTML = config.markets.map((market) => {
    const ready = isWhatsAppMarketReady(market);
    const status = ready ? "Ready for inbound WhatsApp" : "Number pending";
    const phoneLabel = market.phoneNumberE164 || "Delegated in whatsapp.config.js";
    const accountLabel = market.whatsappBusinessAccountId || "Account ID pending";
    const phoneIdLabel = market.phoneNumberId || "Phone number ID pending";
    const action = ready
      ? `<a class="button button--primary whatsapp-card__button" href="${buildWhatsAppUrl(market, config.defaultMessage)}" target="_blank" rel="noopener">Open WhatsApp</a>`
      : `<span class="button whatsapp-card__button is-disabled" aria-disabled="true">Waiting for number</span>`;

    return `
      <article class="whatsapp-card" data-market="${market.id}">
        <span class="whatsapp-card__status ${ready ? "is-ready" : ""}">${status}</span>
        <h3>${market.label}</h3>
        <dl class="whatsapp-card__details">
          <div>
            <dt>Business</dt>
            <dd>${market.legalEntity}</dd>
          </div>
          <div>
            <dt>WhatsApp number</dt>
            <dd>${phoneLabel}</dd>
          </div>
          <div>
            <dt>Business account</dt>
            <dd>${accountLabel}</dd>
          </div>
          <div>
            <dt>Phone number ID</dt>
            <dd>${phoneIdLabel}</dd>
          </div>
        </dl>
        <p>${market.complianceNote}</p>
        ${action}
      </article>
    `;
  }).join("");
}

function appendChatMessage(container, role, text) {
  const message = document.createElement("div");
  message.className = `chatbot-message chatbot-message--${role}`;
  message.textContent = text;
  container.appendChild(message);
  container.scrollTop = container.scrollHeight;
}

function buildDemoChatReply(message, intent, marketLabel) {
  const config = window.SDM_CHATBOT_CONFIG || {};
  const guidance = config.quickReplies?.[intent] || config.quickReplies?.["agent-audit"];
  const trimmed = message.trim();

  if (trimmed.length < 18) {
    return `${guidance} You can start with one sentence about the business and the workflow.`;
  }

  return `For ${marketLabel}, I would start by mapping the current workflow, identifying the handoff delay, and estimating value before building the agent. ${guidance}`;
}

async function sendChatMessage(payload) {
  const config = window.SDM_CHATBOT_CONFIG || {};
  if (!config.apiEndpoint || config.demoMode) {
    return {
      reply: buildDemoChatReply(payload.message, payload.intent, payload.marketLabel),
      mode: "demo"
    };
  }

  const response = await fetch(config.apiEndpoint, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Chat request failed: ${response.status}`);
  }

  return response.json();
}

function setupChatbot() {
  const root = document.querySelector("[data-chatbot]");
  const config = window.SDM_CHATBOT_CONFIG;
  if (!root || !config?.enabled) {
    root?.remove();
    return;
  }

  const toggle = root.querySelector("[data-chat-toggle]");
  const close = root.querySelector("[data-chat-close]");
  const panel = root.querySelector("[data-chat-panel]");
  const form = root.querySelector("[data-chat-form]");
  const input = root.querySelector("[data-chat-input]");
  const messages = root.querySelector("[data-chat-messages]");
  const marketSelect = root.querySelector("[data-chat-market]");
  const intentSelect = root.querySelector("[data-chat-intent]");
  const status = root.querySelector("[data-chat-status]");

  status.textContent = config.apiEndpoint && !config.demoMode ? "Live agent endpoint" : "Demo mode";
  marketSelect.innerHTML = config.markets.map((market) => `<option value="${market.id}">${market.label}</option>`).join("");
  appendChatMessage(messages, "assistant", config.initialMessage);

  function setOpen(isOpen) {
    panel.hidden = !isOpen;
    toggle.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) input.focus();
  }

  toggle.addEventListener("click", () => setOpen(panel.hidden));
  close.addEventListener("click", () => setOpen(false));

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (chatState.isSending) return;

    const message = input.value.trim();
    if (!message) return;

    const market = config.markets.find((entry) => entry.id === marketSelect.value) || config.markets[0];
    const intent = intentSelect.value;
    appendChatMessage(messages, "user", message);
    input.value = "";
    chatState.isSending = true;
    form.querySelector("button").disabled = true;

    try {
      const payload = {
        source: "website-chat",
        conversationId: chatState.conversationId,
        marketId: market.id,
        marketLabel: market.label,
        legalEntity: market.legalEntity,
        intent,
        message,
        page: window.location.pathname,
        sentAt: new Date().toISOString()
      };
      const result = await sendChatMessage(payload);
      appendChatMessage(messages, "assistant", result.reply || "Thanks. I captured this and can route it to the SmartDigitalMinds team.");
    } catch (error) {
      appendChatMessage(messages, "assistant", "I could not reach the chat endpoint. Please email luis.ramirez@opencloud.es with the workflow and market.");
    } finally {
      chatState.isSending = false;
      form.querySelector("button").disabled = false;
      input.focus();
    }
  });
}

document.querySelector(".focus-strip")?.addEventListener("click", updateFocus);

document.querySelectorAll("[data-calculator]").forEach((form) => {
  updateCalculator(form);
  form.addEventListener("input", () => updateCalculator(form));
});

renderWhatsAppMarkets();
setupChatbot();
