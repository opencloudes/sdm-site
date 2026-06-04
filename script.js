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

document.querySelector(".focus-strip")?.addEventListener("click", updateFocus);

document.querySelectorAll("[data-calculator]").forEach((form) => {
  updateCalculator(form);
  form.addEventListener("input", () => updateCalculator(form));
});
