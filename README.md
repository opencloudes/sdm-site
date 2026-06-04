# SmartDigitalMinds Website

Static first-pass website for SmartDigitalMinds.

## Files

- `index.html`: homepage structure and copy.
- `styles.css`: responsive visual system based on the logo palette.
- `script.js`: focus selector and value calculator interactions.
- `whatsapp.config.js`: public WhatsApp market variables for US, Spain/Europe, and UAE.
- `assets/`: logo, icon, and generated hero image.
- `integrations/`: server-side WhatsApp webhook and environment examples.

Open `index.html` in a browser to view the site.

## WhatsApp

The page is ready for three markets but does not expose any live number until `phoneNumberE164` is filled in `whatsapp.config.js`.

Keep Meta access tokens, webhook verify tokens, WhatsApp Business Account IDs, and phone number IDs in the backend deployment environment. Use `integrations/whatsapp.env.example` as the template.
