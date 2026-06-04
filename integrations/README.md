# WhatsApp Integration

This folder keeps the WhatsApp Business Platform setup separate from the static website.

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
