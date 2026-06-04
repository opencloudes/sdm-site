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

document.querySelector(".focus-strip")?.addEventListener("click", updateFocus);

document.querySelectorAll("[data-calculator]").forEach((form) => {
  updateCalculator(form);
  form.addEventListener("input", () => updateCalculator(form));
});

renderWhatsAppMarkets();
