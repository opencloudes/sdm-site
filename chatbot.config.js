window.SDM_CHATBOT_CONFIG = {
  enabled: true,
  apiEndpoint: window.SDM_CHATBOT_API_ENDPOINT || "/api/chat",
  demoMode: false,
  handoffEmail: "luis.ramirez@opencloud.es",
  assistantName: "SmartDigitalMinds Assistant",
  initialMessage: "Hi. I can help scope an agent audit, lead follow-up workflow, operations automation, or WhatsApp integration.",
  markets: [
    {
      id: "us",
      label: "United States",
      legalEntity: "OPENCLOUD GLOBAL SERVICES, LLC",
      language: "en",
      handoffEmail: "luis.ramirez@opencloud.es"
    },
    {
      id: "spain",
      label: "Spain / Europe",
      legalEntity: "OpenCloud AADD SL",
      language: "en",
      handoffEmail: "luis.ramirez@opencloud.es"
    },
    {
      id: "uae",
      label: "UAE",
      legalEntity: "Pending UAE entity",
      language: "en",
      handoffEmail: "luis.ramirez@opencloud.es"
    }
  ],
  quickReplies: {
    "agent-audit": "For an agent audit, please share the workflow, current tools, volume per week, and where delays appear.",
    "lead-followup": "For lead follow-up, please share lead sources, average response time, missed-call volume, and current handoff process.",
    operations: "For operations automation, please share the repetitive task, who owns it, current tools, and what a successful result looks like.",
    whatsapp: "For WhatsApp, please share the market, opt-in source, expected message types, and whether the business number is already approved."
  }
};
