# SmartDigitalMinds Chatbot Backend

Small Go API for the website chatbot. It receives `POST /api/chat` from the static site, applies basic guardrails, and forwards the request to either an OpenClaw WebSocket gateway or a regular HTTP agent webhook when configured.

No secrets are hardcoded. Keep tokens and webhook URLs in server environment variables only.

## Endpoints

- `GET /healthz`
- `POST /api/chat`
- `OPTIONS /api/chat`

## Environment

Copy `chatbot.env.example` to `chatbot.env` on the server and fill the private values there.

Key variables:

- `OPENCLAW_AGENT_TRANSPORT`: use `openclaw-gateway` for the OpenClaw WebSocket gateway, or `webhook` for a regular HTTP JSON endpoint.
- `OPENCLAW_AGENT_URL`: private OpenClaw gateway or agent endpoint to call. For the tested OpenClaw server, use `http://192.168.50.128:18789/`; the backend upgrades it to WebSocket internally.
- `OPENCLAW_AGENT_TOKEN`: optional bearer token for that endpoint. Keep the real value only in `chatbot.env` on the server.
- `OPENCLAW_ORIGIN`: WebSocket origin allowed by OpenClaw. For the tested gateway, use `http://192.168.50.128:18789`.
- `OPENCLAW_SESSION_KEY`: OpenClaw chat session key. Default is `main`.
- `OPENCLAW_AGENT_ID`: optional OpenClaw agent id when routing to a specific agent.
- `CHAT_ALLOWED_ORIGIN`: public website origin, for example `https://smartdigitalminds.com`.
- `CHAT_DEMO_FALLBACK`: set `false` when you want the API to fail if the agent endpoint is not configured.
- `CHAT_FALLBACK_EMAIL`: human handoff email used in fallback replies.

`CHAT_AGENT_WEBHOOK_URL` and `CHAT_AGENT_WEBHOOK_TOKEN` are supported as aliases for the older JavaScript example.

## Run Locally

```sh
cd backend/chatbot
cp chatbot.env.example chatbot.env
go run ./cmd/server
```

Test:

```sh
curl -s http://127.0.0.1:8790/healthz
curl -s http://127.0.0.1:8790/api/chat \
  -H 'content-type: application/json' \
  -d '{"conversationId":"local-test","marketId":"spain","marketLabel":"España / Europa","intent":"agent-audit","message":"Quiero mejorar el seguimiento de presupuestos","language":"es"}'
```

## Docker

```sh
cd backend/chatbot
cp chatbot.env.example chatbot.env
docker build -t smartdigitalminds-chatbot .
docker run --env-file chatbot.env -p 8790:8790 smartdigitalminds-chatbot
```

Or:

```sh
docker compose -f docker-compose.example.yml up --build
```

## OpenClaw Deployment

Use this path when deploying the backend on the OpenClaw server in Docker.

### 1. Copy the Backend to the Server

From the project root, deploy the `backend/chatbot` directory to the server:

```sh
rsync -av backend/chatbot/ user@openclaw-server:/opt/smartdigitalminds-chatbot/
```

Use the real OpenClaw SSH host/user for `user@openclaw-server`.

### 2. Create the Server Environment File

On the OpenClaw server:

```sh
cd /opt/smartdigitalminds-chatbot
cp chatbot.env.example chatbot.env
chmod 600 chatbot.env
```

Edit `chatbot.env` on the server only:

```sh
nano chatbot.env
```

Set at least:

```sh
PORT=8790
CHAT_ALLOWED_ORIGIN=https://smartdigitalminds.com
OPENCLAW_AGENT_TRANSPORT=openclaw-gateway
OPENCLAW_AGENT_URL=http://192.168.50.128:18789/
OPENCLAW_AGENT_TOKEN=your-private-token
OPENCLAW_ORIGIN=http://192.168.50.128:18789
OPENCLAW_SESSION_KEY=main
OPENCLAW_SCOPES=operator.read,operator.write
CHAT_AGENT_TIMEOUT_SECONDS=75
CHAT_DEMO_FALLBACK=false
```

Leave `OPENCLAW_AGENT_TOKEN` empty only if the upstream OpenClaw agent endpoint does not require a bearer token.

The OpenClaw gateway is a WebSocket endpoint even though the tested curl command uses `http://` with an `Upgrade: websocket` header. Keep `OPENCLAW_AGENT_URL` as the gateway root URL; the backend normalizes `http://` to `ws://` when `OPENCLAW_AGENT_TRANSPORT=openclaw-gateway`.

### 3. Build the Docker Image

```sh
cd /opt/smartdigitalminds-chatbot
docker build -t smartdigitalminds-chatbot .
```

### 4. Run the Container

Simple Docker run:

```sh
docker run -d \
  --name smartdigitalminds-chatbot \
  --env-file /opt/smartdigitalminds-chatbot/chatbot.env \
  -p 127.0.0.1:8790:8790 \
  --restart unless-stopped \
  smartdigitalminds-chatbot
```

Or use Compose:

```sh
cp docker-compose.example.yml docker-compose.yml
docker compose up -d --build
```

If using Compose, prefer binding to localhost in production:

```yaml
ports:
  - "127.0.0.1:8790:8790"
```

### 5. Add Reverse Proxy Routing

Recommended routing:

- Static website serves `https://smartdigitalminds.com/`
- Go container listens internally on `:8790`
- Reverse proxy maps `https://smartdigitalminds.com/api/chat` to `http://chatbot-container:8790/api/chat`

Example Nginx location block:

```nginx
location /api/chat {
    proxy_pass http://127.0.0.1:8790/api/chat;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

location /healthz {
    proxy_pass http://127.0.0.1:8790/healthz;
}
```

Reload the proxy after changing its config:

```sh
nginx -t
systemctl reload nginx
```

### 6. Verify the Deployment

On the server:

```sh
curl -s http://127.0.0.1:8790/healthz
```

From outside the server:

```sh
curl -s https://smartdigitalminds.com/healthz
```

Test the chat route:

```sh
curl -s https://smartdigitalminds.com/api/chat \
  -H 'content-type: application/json' \
  -d '{"conversationId":"deploy-test","marketId":"spain","marketLabel":"España / Europa","intent":"agent-audit","message":"Quiero mejorar el seguimiento de presupuestos","language":"es"}'
```

Expected shape:

```json
{
  "reply": "…",
  "mode": "agent",
  "conversationId": "deploy-test"
}
```

If `CHAT_DEMO_FALLBACK=true` and the OpenClaw agent is not configured, `mode` can be `fallback`.

Local OpenClaw gateway verification:

```sh
curl -s http://127.0.0.1:8790/api/chat \
  -H 'content-type: application/json' \
  -d '{"conversationId":"openclaw-test","marketId":"spain","marketLabel":"España / Europa","intent":"agent-audit","message":"Responde solo con: OpenClaw conectado correctamente","language":"es-ES"}'
```

Expected result when the gateway accepts the token and origin:

```json
{
  "reply": "OpenClaw conectado correctamente",
  "mode": "agent",
  "conversationId": "openclaw-test"
}
```

### 7. Connect the Website

The public website only needs `apiEndpoint: "/api/chat"` in `site/chatbot.config.js`. Do not put agent URLs, API keys, or tokens in browser-visible JavaScript.

After deployment, open the site and send a test message through the chat widget. In browser dev tools, the request should go to:

```text
https://smartdigitalminds.com/api/chat
```

### 8. Update Safely

When deploying a new backend version:

```sh
cd /opt/smartdigitalminds-chatbot
docker build -t smartdigitalminds-chatbot .
docker stop smartdigitalminds-chatbot
docker rm smartdigitalminds-chatbot
docker run -d \
  --name smartdigitalminds-chatbot \
  --env-file /opt/smartdigitalminds-chatbot/chatbot.env \
  -p 127.0.0.1:8790:8790 \
  --restart unless-stopped \
  smartdigitalminds-chatbot
```

Keep `chatbot.env` out of git, backups, screenshots, and public browser-visible files.
