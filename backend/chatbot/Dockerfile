FROM golang:1.22-alpine AS build

WORKDIR /src
COPY go.mod ./
COPY cmd ./cmd

RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w" -o /out/chatbot ./cmd/server

FROM alpine:3.20

RUN apk add --no-cache ca-certificates && adduser -D -H -u 10001 appuser
WORKDIR /app

COPY --from=build /out/chatbot /app/chatbot

USER appuser
EXPOSE 8790

ENTRYPOINT ["/app/chatbot"]
