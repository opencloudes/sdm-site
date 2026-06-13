window.SDM_CHATBOT_CONFIG = {
  enabled: true,
  apiEndpoint: window.SDM_CHATBOT_API_ENDPOINT || "/api/chat",
  demoMode: false,
  handoffEmail: "agents@smartdigitalminds.com",
  assistantName: "SmartDigitalMinds Assistant",
  initialMessage: "Hi. I can help scope an agent audit, lead follow-up workflow, operations automation, WhatsApp integration, and many other workflows.",
  useGlobalMarket: true,
  globalMarket: {
    id: "global",
    label: "Global",
    legalEntity: "SmartDigitalMinds",
    language: "en",
    handoffEmail: "agents@smartdigitalminds.com"
  },
  markets: [
    {
      id: "us",
      label: "United States",
      legalEntity: "OPENCLOUD GLOBAL SERVICES, LLC",
      language: "en",
      handoffEmail: "agents@smartdigitalminds.com"
    },
    {
      id: "spain",
      label: "Spain / Europe",
      legalEntity: "OpenCloud AADD SL",
      language: "en",
      handoffEmail: "agents@smartdigitalminds.com"
    },
    {
      id: "uae",
      label: "UAE",
      legalEntity: "Pending UAE entity",
      language: "en",
      handoffEmail: "agents@smartdigitalminds.com"
    }
  ],
  quickReplies: {
    "agent-audit": "For an agent audit, please share the workflow, current tools, volume per week, and where delays appear.",
    "lead-followup": "For lead follow-up, please share lead sources, average response time, missed-call volume, and current handoff process.",
    "operations": "For operations automation, please share the repetitive task, who owns it, current tools, and what a successful result looks like.",
    "whatsapp": "For WhatsApp, please share the market, opt-in source, expected message types, and whether the business number is already approved.",
    "other": "For Other, please share the information about your process, workflow, and contact details."
  }
};
