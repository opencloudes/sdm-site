const LANGUAGE_STORAGE_KEY = "sdm-language";
const supportedLanguages = ["en", "es", "fr", "de", "it"];
const regionLanguageMap = {
  AT: "de",
  CH: "de",
  DE: "de",
  ES: "es",
  FR: "fr",
  IT: "it",
  LI: "de",
  MC: "fr",
  SM: "it",
  VA: "it"
};
const timezoneLanguageMap = {
  "Europe/Berlin": "de",
  "Europe/Busingen": "de",
  "Europe/Madrid": "es",
  "Atlantic/Canary": "es",
  "Africa/Ceuta": "es",
  "Europe/Paris": "fr",
  "Europe/Monaco": "fr",
  "Europe/Rome": "it",
  "Europe/San_Marino": "it",
  "Europe/Vatican": "it",
  "Europe/Vienna": "de",
  "Europe/Zurich": "de"
};

const translations = {
  en: {
    locale: "en-US",
    htmlLang: "en-US",
    meta: {
      title: "SmartDigitalMinds | Business Agent Operations",
      description: "SmartDigitalMinds builds and runs AI agents that support business operations, improve automation, and focus on measurable value."
    },
    language: {
      selectorAria: "Language selector"
    },
    brand: {
      home: "SmartDigitalMinds home"
    },
    nav: {
      aria: "Main navigation",
      agents: "Agents",
      run: "Run Model",
      whatsapp: "WhatsApp",
      value: "Value",
      contact: "Contact"
    },
    hero: {
      eyebrow: "Business agent operations",
      lead: "We build and run practical AI agents for the workflows where speed, follow-up, reporting, and consistency create measurable business value.",
      primaryCta: "Request an agent audit",
      secondaryCta: "Estimate value",
      actionsAria: "Primary actions"
    },
    focus: {
      selectorAria: "Agent focus selector",
      tabsAria: "Agent focus",
      tabs: {
        leads: "Lead response",
        ops: "Operations",
        insight: "Management insight"
      },
      messages: {
        leads: "First win: reduce missed-call delay and recover inquiries that usually disappear.",
        ops: "First win: remove repeated admin steps and give the team a clear escalation path.",
        insight: "First win: turn daily activity into a weekly decision view managers can act on."
      }
    },
    intro: {
      eyebrow: "Built for value, not novelty",
      title: "Agents that fit the way the business already runs.",
      cards: [
        {
          title: "Find the workflow leak",
          body: "We start where delays, duplicated effort, missed follow-up, and unclear ownership cost money."
        },
        {
          title: "Build the agent system",
          body: "Agents connect the intake, data, messages, approvals, and reporting steps that need consistency."
        },
        {
          title: "Run and improve it",
          body: "We keep the system monitored, measured, and adjusted as real usage shows what creates value."
        }
      ]
    },
    agents: {
      eyebrow: "What we build",
      title: "Business agents for the work between the customer, the team, and the numbers.",
      cards: [
        {
          title: "Lead intake agents",
          body: "Capture new inquiries, missed calls, quote requests, website forms, and handoffs before they go cold."
        },
        {
          title: "Follow-up agents",
          body: "Send timely reminders, review requests, status updates, and next-step messages with clear rules."
        },
        {
          title: "Back-office agents",
          body: "Reduce repeated admin work across scheduling, data cleanup, summaries, routing, and internal requests."
        },
        {
          title: "Reporting agents",
          body: "Turn activity into weekly numbers, alerts, and practical recommendations for managers and owners."
        }
      ]
    },
    run: {
      eyebrow: "Build and run",
      title: "The agent is only useful when it keeps working after launch.",
      body: "SmartDigitalMinds treats agents as an operating layer. We define the workflow, build the automation, monitor outcomes, and refine the system against the value it is supposed to produce.",
      steps: [
        {
          label: "Map",
          body: "Workflow, data, decision points, owner."
        },
        {
          label: "Build",
          body: "Agent behavior, integrations, messages, reporting."
        },
        {
          label: "Run",
          body: "Monitoring, quality checks, escalation paths."
        },
        {
          label: "Improve",
          body: "Measure value, remove friction, expand only where it pays."
        }
      ]
    },
    calculator: {
      eyebrow: "Value calculator",
      title: "Start with the business case.",
      body: "A useful agent should reduce operating drag or recover revenue. This quick estimate frames the first target.",
      hours: "Hours saved per week",
      rate: "Hourly business value",
      leads: "Recovered leads per month",
      leadValue: "Average lead value",
      result: "Estimated monthly value"
    },
    whatsapp: {
      eyebrow: "WhatsApp integration",
      title: "One agent layer, three market channels.",
      body: "WhatsApp can receive inbound audit requests now and later connect to Meta's Business Platform for agent-assisted replies, templates, handoffs, and reporting. Numbers and account IDs are delegated through configuration, so the page is ready before the channels are live.",
      loadingStatus: "Loading markets",
      loadingTitle: "WhatsApp channels",
      loadingBody: "Market configuration is loading.",
      flowAria: "WhatsApp agent flow",
      flow: ["Inbound opt-in", "Market routing", "Agent triage", "Human handoff", "Value reporting"],
      defaultMessage: "Hello SmartDigitalMinds, I would like an agent audit for my business.",
      statusReady: "Ready for inbound WhatsApp",
      statusPending: "Number pending",
      phonePending: "Delegated in whatsapp.config.js",
      accountPending: "Account ID pending",
      phoneIdPending: "Phone number ID pending",
      detailsBusiness: "Business",
      detailsNumber: "WhatsApp number",
      detailsAccount: "Business account",
      detailsPhoneId: "Phone number ID",
      openAction: "Open WhatsApp",
      waitingAction: "Waiting for number"
    },
    sectors: {
      eyebrow: "Where to start",
      title: "Good first workflows are visible, repetitive, and measurable.",
      items: [
        "Local service intake",
        "Quote follow-up",
        "Review requests",
        "Appointment reminders",
        "Weekly management reports",
        "Internal task routing"
      ]
    },
    contact: {
      eyebrow: "Next step",
      title: "Pick one workflow and make its value obvious.",
      body: "Send the workflow, current tool stack, and where the delay or missed value appears."
    },
    chat: {
      rootAria: "SmartDigitalMinds chat assistant",
      toggle: "Agent chat",
      assistantName: "SmartDigitalMinds Assistant",
      statusDemo: "Demo mode",
      statusLive: "Live agent endpoint",
      closeAria: "Close chat",
      market: "Market",
      marketAria: "Select market",
      need: "Need",
      intentAria: "Select topic",
      intents: {
        "agent-audit": "Agent audit",
        "lead-followup": "Lead follow-up",
        operations: "Operations automation",
        whatsapp: "WhatsApp integration"
      },
      messageLabel: "Message",
      placeholder: "Tell us the workflow you want to improve",
      send: "Send",
      note: "No outreach or WhatsApp message is sent from this chat unless a live backend is configured.",
      initialMessage: "Hi. I can help scope an agent audit, lead follow-up workflow, operations automation, or WhatsApp integration.",
      quickReplies: {
        "agent-audit": "For an agent audit, please share the workflow, current tools, volume per week, and where delays appear.",
        "lead-followup": "For lead follow-up, please share lead sources, average response time, missed-call volume, and current handoff process.",
        operations: "For operations automation, please share the repetitive task, who owns it, current tools, and what a successful result looks like.",
        whatsapp: "For WhatsApp, please share the market, opt-in source, expected message types, and whether the business number is already approved."
      },
      shortPromptSuffix: "You can start with one sentence about the business and the workflow.",
      longPrompt: "For {marketLabel}, I would start by mapping the current workflow, identifying the handoff delay, and estimating value before building the agent. {guidance}",
      captured: "Thanks. I captured this and can route it to the SmartDigitalMinds team.",
      endpointError: "I could not reach the chat endpoint. Please email luis.ramirez@opencloud.es with the workflow and market."
    },
    footer: {
      body: "SmartDigitalMinds builds and runs business agents focused on automation value."
    },
    mail: {
      auditSubject: "SmartDigitalMinds agent audit"
    },
    markets: {
      us: {
        label: "United States",
        whatsappMessage: "Hello SmartDigitalMinds, I would like an agent audit for a US business.",
        complianceNote: "Activate only after the US WhatsApp number and opt-in path are approved."
      },
      spain: {
        label: "Spain / Europe",
        whatsappMessage: "Hola SmartDigitalMinds, quiero una auditoría de agentes para mi negocio.",
        complianceNote: "Use permission-first inbound WhatsApp, QR, or explicit website opt-in."
      },
      uae: {
        label: "UAE",
        whatsappMessage: "Hello SmartDigitalMinds, I would like an agent audit for a UAE business.",
        complianceNote: "Keep outbound disabled until UAE entity, address, number, and opt-in are ready."
      },
      pendingUaeEntity: "Pending UAE entity"
    }
  },
  es: {
    locale: "es-ES",
    htmlLang: "es-ES",
    meta: {
      title: "SmartDigitalMinds | Operaciones con agentes para empresas",
      description: "SmartDigitalMinds diseña y gestiona agentes de IA que apoyan las operaciones de negocio, mejoran la automatización y se centran en valor medible."
    },
    language: {
      selectorAria: "Selector de idioma"
    },
    brand: {
      home: "Inicio de SmartDigitalMinds"
    },
    nav: {
      aria: "Navegación principal",
      agents: "Agentes",
      run: "Modelo operativo",
      whatsapp: "WhatsApp",
      value: "Valor",
      contact: "Contacto"
    },
    hero: {
      eyebrow: "Operaciones con agentes para empresas",
      lead: "Diseñamos y gestionamos agentes de IA prácticos para los procesos en los que la rapidez, el seguimiento, los informes y la consistencia generan valor empresarial medible.",
      primaryCta: "Solicitar una auditoría de agentes",
      secondaryCta: "Estimar valor",
      actionsAria: "Acciones principales"
    },
    focus: {
      selectorAria: "Selector de enfoque del agente",
      tabsAria: "Enfoque del agente",
      tabs: {
        leads: "Respuesta a contactos",
        ops: "Operaciones",
        insight: "Visión de gestión"
      },
      messages: {
        leads: "Primer resultado: reducir el retraso en llamadas perdidas y recuperar consultas que normalmente se pierden.",
        ops: "Primer resultado: eliminar tareas administrativas repetidas y dar al equipo una vía clara de escalado.",
        insight: "Primer resultado: convertir la actividad diaria en una vista semanal de decisiones para responsables."
      }
    },
    intro: {
      eyebrow: "Construidos para generar valor, no novedad",
      title: "Agentes que encajan con la forma en que la empresa ya trabaja.",
      cards: [
        {
          title: "Encontrar el punto débil del proceso",
          body: "Empezamos donde los retrasos, el trabajo duplicado, el seguimiento perdido y la falta de responsable cuestan dinero."
        },
        {
          title: "Construir el sistema de agentes",
          body: "Los agentes conectan la entrada, los datos, los mensajes, las aprobaciones y los informes que necesitan consistencia."
        },
        {
          title: "Gestionarlo y mejorarlo",
          body: "Mantenemos el sistema supervisado, medido y ajustado a medida que el uso real muestra dónde se crea valor."
        }
      ]
    },
    agents: {
      eyebrow: "Qué construimos",
      title: "Agentes empresariales para el trabajo entre el cliente, el equipo y los números.",
      cards: [
        {
          title: "Agentes de entrada de contactos",
          body: "Capturan nuevas consultas, llamadas perdidas, solicitudes de presupuesto, formularios web y derivaciones antes de que se enfríen."
        },
        {
          title: "Agentes de seguimiento",
          body: "Envían recordatorios, solicitudes de reseñas, actualizaciones de estado y mensajes sobre el siguiente paso con reglas claras."
        },
        {
          title: "Agentes de administración interna",
          body: "Reducen tareas administrativas repetidas en agenda, limpieza de datos, resúmenes, asignación y solicitudes internas."
        },
        {
          title: "Agentes de informes",
          body: "Convierten la actividad en cifras semanales, alertas y recomendaciones prácticas para responsables y propietarios."
        }
      ]
    },
    run: {
      eyebrow: "Construir y gestionar",
      title: "El agente solo es útil cuando sigue funcionando después del lanzamiento.",
      body: "SmartDigitalMinds trata los agentes como una capa operativa. Definimos el proceso, construimos la automatización, supervisamos resultados y refinamos el sistema frente al valor que debe producir.",
      steps: [
        {
          label: "Mapear",
          body: "Proceso, datos, decisiones y responsable."
        },
        {
          label: "Construir",
          body: "Comportamiento del agente, integraciones, mensajes e informes."
        },
        {
          label: "Gestionar",
          body: "Supervisión, controles de calidad y vías de escalado."
        },
        {
          label: "Mejorar",
          body: "Medir el valor, eliminar fricción y ampliar solo donde compense."
        }
      ]
    },
    calculator: {
      eyebrow: "Calculadora de valor",
      title: "Empieza por el caso de negocio.",
      body: "Un agente útil debe reducir fricción operativa o recuperar ingresos. Esta estimación rápida define el primer objetivo.",
      hours: "Horas ahorradas por semana",
      rate: "Valor empresarial por hora",
      leads: "Contactos recuperados al mes",
      leadValue: "Valor medio por contacto",
      result: "Valor mensual estimado"
    },
    whatsapp: {
      eyebrow: "Integración con WhatsApp",
      title: "Una capa de agentes, tres canales comerciales.",
      body: "WhatsApp puede recibir solicitudes de auditoría desde ahora y, más adelante, conectarse a la plataforma Business de Meta para respuestas asistidas por agentes, plantillas, derivaciones e informes. Los números y los ID de cuenta se gestionan desde la configuración, así que la página está lista antes de que los canales estén activos.",
      loadingStatus: "Cargando mercados",
      loadingTitle: "Canales de WhatsApp",
      loadingBody: "La configuración del mercado se está cargando.",
      flowAria: "Flujo del agente de WhatsApp",
      flow: ["Consentimiento de entrada", "Asignación por mercado", "Clasificación del agente", "Derivación a una persona", "Informe de valor"],
      defaultMessage: "Hola SmartDigitalMinds, quiero una auditoría de agentes para mi negocio.",
      statusReady: "Listo para WhatsApp de entrada",
      statusPending: "Número pendiente",
      phonePending: "Configurado en whatsapp.config.js",
      accountPending: "ID de cuenta pendiente",
      phoneIdPending: "ID de número pendiente",
      detailsBusiness: "Empresa",
      detailsNumber: "Número de WhatsApp",
      detailsAccount: "Cuenta empresarial",
      detailsPhoneId: "ID del número",
      openAction: "Abrir WhatsApp",
      waitingAction: "Esperando número"
    },
    sectors: {
      eyebrow: "Dónde empezar",
      title: "Los buenos primeros procesos son visibles, repetitivos y medibles.",
      items: [
        "Entrada de servicios locales",
        "Seguimiento de presupuestos",
        "Solicitudes de reseñas",
        "Recordatorios de citas",
        "Informes semanales de gestión",
        "Asignación interna de tareas"
      ]
    },
    contact: {
      eyebrow: "Siguiente paso",
      title: "Elige un proceso y haz evidente su valor.",
      body: "Envía el proceso, las herramientas actuales y dónde aparece el retraso o el valor perdido."
    },
    chat: {
      rootAria: "Asistente de chat de SmartDigitalMinds",
      toggle: "Chat de agente",
      assistantName: "Asistente de SmartDigitalMinds",
      statusDemo: "Modo demo",
      statusLive: "Punto de conexión del agente activo",
      closeAria: "Cerrar chat",
      market: "Mercado",
      marketAria: "Seleccionar mercado",
      need: "Necesidad",
      intentAria: "Seleccionar tema",
      intents: {
        "agent-audit": "Auditoría de agentes",
        "lead-followup": "Seguimiento de contactos",
        operations: "Automatización operativa",
        whatsapp: "Integración con WhatsApp"
      },
      messageLabel: "Mensaje",
      placeholder: "Cuéntanos el proceso que quieres mejorar",
      send: "Enviar",
      note: "No se envía ninguna comunicación comercial ni mensaje de WhatsApp desde este chat salvo que se configure un sistema activo.",
      initialMessage: "Hola. Puedo ayudar a definir una auditoría de agentes, un proceso de seguimiento de contactos, automatización operativa o integración con WhatsApp.",
      quickReplies: {
        "agent-audit": "Para una auditoría de agentes, comparte el proceso, las herramientas actuales, el volumen semanal y dónde aparecen los retrasos.",
        "lead-followup": "Para seguimiento de contactos, comparte las fuentes de contactos, el tiempo medio de respuesta, el volumen de llamadas perdidas y el proceso actual de derivación.",
        operations: "Para automatización operativa, comparte la tarea repetitiva, quién la gestiona, herramientas actuales y cómo se ve un resultado exitoso.",
        whatsapp: "Para WhatsApp, comparte el mercado, la fuente de consentimiento, los tipos de mensajes previstos y si el número de empresa ya está aprobado."
      },
      shortPromptSuffix: "Puedes empezar con una frase sobre la empresa y el proceso.",
      longPrompt: "Para {marketLabel}, empezaría analizando el proceso actual, identificando el retraso en la derivación y estimando el valor antes de construir el agente. {guidance}",
      captured: "Gracias. He capturado esto y puedo dirigirlo al equipo de SmartDigitalMinds.",
      endpointError: "No he podido contactar con el punto de conexión del chat. Escribe a luis.ramirez@opencloud.es con el proceso y el mercado."
    },
    footer: {
      body: "SmartDigitalMinds diseña y gestiona agentes empresariales centrados en el valor de la automatización."
    },
    mail: {
      auditSubject: "Auditoría de agentes de SmartDigitalMinds"
    },
    markets: {
      us: {
        label: "Estados Unidos",
        whatsappMessage: "Hola SmartDigitalMinds, quiero una auditoría de agentes para un negocio en Estados Unidos.",
        complianceNote: "Activar solo después de aprobar el número de WhatsApp de EE. UU. y la vía de consentimiento."
      },
      spain: {
        label: "España / Europa",
        whatsappMessage: "Hola SmartDigitalMinds, quiero una auditoría de agentes para mi negocio.",
        complianceNote: "Usar WhatsApp de entrada con permiso previo, QR o consentimiento explícito en la web."
      },
      uae: {
        label: "EAU",
        whatsappMessage: "Hola SmartDigitalMinds, quiero una auditoría de agentes para un negocio en EAU.",
        complianceNote: "Mantener desactivado el envío saliente hasta que la entidad, dirección, número y consentimiento de EAU estén listos."
      },
      pendingUaeEntity: "Entidad de EAU pendiente"
    }
  },
  fr: {
    locale: "fr-FR",
    htmlLang: "fr-FR",
    meta: {
      title: "SmartDigitalMinds | Opérations d'agents pour l'entreprise",
      description: "SmartDigitalMinds conçoit et exploite des agents IA qui soutiennent les opérations métier, améliorent l'automatisation et se concentrent sur une valeur mesurable."
    },
    language: {
      selectorAria: "Sélecteur de langue"
    },
    brand: {
      home: "Accueil SmartDigitalMinds"
    },
    nav: {
      aria: "Navigation principale",
      agents: "Agents",
      run: "Modèle opérationnel",
      whatsapp: "WhatsApp",
      value: "Valeur",
      contact: "Contact"
    },
    hero: {
      eyebrow: "Opérations d'agents pour l'entreprise",
      lead: "Nous concevons et exploitons des agents IA pratiques pour les flux de travail où la vitesse, le suivi, le reporting et la régularité créent une valeur métier mesurable.",
      primaryCta: "Demander un audit d'agents",
      secondaryCta: "Estimer la valeur",
      actionsAria: "Actions principales"
    },
    focus: {
      selectorAria: "Sélecteur de priorité de l'agent",
      tabsAria: "Priorité de l'agent",
      tabs: {
        leads: "Réponse aux prospects",
        ops: "Opérations",
        insight: "Vision de gestion"
      },
      messages: {
        leads: "Premier gain : réduire le délai après les appels manqués et récupérer les demandes qui disparaissent habituellement.",
        ops: "Premier gain : supprimer les tâches administratives répétées et donner à l'équipe un chemin d'escalade clair.",
        insight: "Premier gain : transformer l'activité quotidienne en vue hebdomadaire de décision pour les managers."
      }
    },
    intro: {
      eyebrow: "Conçu pour la valeur, pas pour l'effet de mode",
      title: "Des agents qui s'adaptent à la manière dont l'entreprise fonctionne déjà.",
      cards: [
        {
          title: "Trouver la fuite dans le flux de travail",
          body: "Nous commençons là où les délais, les doublons, les suivis manqués et le manque de responsabilité coûtent de l'argent."
        },
        {
          title: "Construire le système d'agents",
          body: "Les agents relient l'entrée, les données, les messages, les validations et le reporting qui exigent de la régularité."
        },
        {
          title: "L'exploiter et l'améliorer",
          body: "Nous gardons le système supervisé, mesuré et ajusté à mesure que l'usage réel montre ce qui crée de la valeur."
        }
      ]
    },
    agents: {
      eyebrow: "Ce que nous construisons",
      title: "Des agents métier pour le travail entre le client, l'équipe et les chiffres.",
      cards: [
        {
          title: "Agents de réception des prospects",
          body: "Capturent les nouvelles demandes, appels manqués, demandes de devis, formulaires web et transferts avant qu'ils ne refroidissent."
        },
        {
          title: "Agents de suivi",
          body: "Envoient des rappels, demandes d'avis, mises à jour de statut et messages de prochaine étape avec des règles claires."
        },
        {
          title: "Agents de back-office",
          body: "Réduisent le travail administratif répété dans la planification, le nettoyage des données, les résumés, le routage et les demandes internes."
        },
        {
          title: "Agents de reporting",
          body: "Transforment l'activité en chiffres hebdomadaires, alertes et recommandations pratiques pour managers et dirigeants."
        }
      ]
    },
    run: {
      eyebrow: "Construire et exploiter",
      title: "L'agent n'est utile que s'il continue de fonctionner après le lancement.",
      body: "SmartDigitalMinds traite les agents comme une couche opérationnelle. Nous définissons le flux de travail, construisons l'automatisation, surveillons les résultats et affinons le système selon la valeur attendue.",
      steps: [
        {
          label: "Cartographier",
          body: "Flux de travail, données, décisions et responsable."
        },
        {
          label: "Construire",
          body: "Comportement de l'agent, intégrations, messages et reporting."
        },
        {
          label: "Exploiter",
          body: "Surveillance, contrôles qualité et chemins d'escalade."
        },
        {
          label: "Améliorer",
          body: "Mesurer la valeur, réduire la friction et étendre seulement quand cela paie."
        }
      ]
    },
    calculator: {
      eyebrow: "Calculateur de valeur",
      title: "Commencer par le cas métier.",
      body: "Un agent utile doit réduire la friction opérationnelle ou récupérer du chiffre d'affaires. Cette estimation rapide cadre le premier objectif.",
      hours: "Heures économisées par semaine",
      rate: "Valeur métier horaire",
      leads: "Prospects récupérés par mois",
      leadValue: "Valeur moyenne par prospect",
      result: "Valeur mensuelle estimée"
    },
    whatsapp: {
      eyebrow: "Intégration WhatsApp",
      title: "Une couche d'agents, trois canaux de marché.",
      body: "WhatsApp peut recevoir des demandes d'audit entrantes dès maintenant, puis se connecter plus tard à la plateforme Business de Meta pour des réponses assistées par agent, des modèles, des transferts et du reporting. Les numéros et ID de compte sont délégués par configuration, afin que la page soit prête avant l'activation des canaux.",
      loadingStatus: "Chargement des marchés",
      loadingTitle: "Canaux WhatsApp",
      loadingBody: "La configuration du marché est en cours de chargement.",
      flowAria: "Flux de l'agent WhatsApp",
      flow: ["Opt-in entrant", "Routage par marché", "Triage par l'agent", "Transfert humain", "Reporting de valeur"],
      defaultMessage: "Bonjour SmartDigitalMinds, je souhaite un audit d'agents pour mon entreprise.",
      statusReady: "Prêt pour WhatsApp entrant",
      statusPending: "Numéro en attente",
      phonePending: "Délégué dans whatsapp.config.js",
      accountPending: "ID de compte en attente",
      phoneIdPending: "ID de numéro en attente",
      detailsBusiness: "Entreprise",
      detailsNumber: "Numéro WhatsApp",
      detailsAccount: "Compte Business",
      detailsPhoneId: "ID du numéro",
      openAction: "Ouvrir WhatsApp",
      waitingAction: "En attente du numéro"
    },
    sectors: {
      eyebrow: "Où commencer",
      title: "Les bons premiers flux de travail sont visibles, répétitifs et mesurables.",
      items: [
        "Réception de services locaux",
        "Suivi des devis",
        "Demandes d'avis",
        "Rappels de rendez-vous",
        "Rapports hebdomadaires de gestion",
        "Routage des tâches internes"
      ]
    },
    contact: {
      eyebrow: "Prochaine étape",
      title: "Choisir un flux de travail et rendre sa valeur évidente.",
      body: "Envoyez le flux de travail, les outils actuels et l'endroit où le délai ou la valeur perdue apparaît."
    },
    chat: {
      rootAria: "Assistant de chat SmartDigitalMinds",
      toggle: "Chat agent",
      assistantName: "Assistant SmartDigitalMinds",
      statusDemo: "Mode démo",
      statusLive: "Agent en direct",
      closeAria: "Fermer le chat",
      market: "Marché",
      marketAria: "Sélectionner le marché",
      need: "Besoin",
      intentAria: "Sélectionner le sujet",
      intents: {
        "agent-audit": "Audit d'agents",
        "lead-followup": "Suivi des prospects",
        operations: "Automatisation des opérations",
        whatsapp: "Intégration WhatsApp"
      },
      messageLabel: "Message",
      placeholder: "Décrivez le flux de travail à améliorer",
      send: "Envoyer",
      note: "Aucune prospection ni aucun message WhatsApp n'est envoyé depuis ce chat sauf si un backend actif est configuré.",
      initialMessage: "Bonjour. Je peux aider à cadrer un audit d'agents, un flux de suivi des prospects, une automatisation opérationnelle ou une intégration WhatsApp.",
      quickReplies: {
        "agent-audit": "Pour un audit d'agents, indiquez le flux de travail, les outils actuels, le volume hebdomadaire et où apparaissent les délais.",
        "lead-followup": "Pour le suivi des prospects, indiquez les sources, le temps moyen de réponse, le volume d'appels manqués et le processus actuel de transfert.",
        operations: "Pour l'automatisation des opérations, indiquez la tâche répétitive, son responsable, les outils actuels et ce qui définit un résultat réussi.",
        whatsapp: "Pour WhatsApp, indiquez le marché, la source d'opt-in, les types de messages attendus et si le numéro professionnel est déjà approuvé."
      },
      shortPromptSuffix: "Vous pouvez commencer par une phrase sur l'entreprise et le flux de travail.",
      longPrompt: "Pour {marketLabel}, je commencerais par cartographier le flux actuel, repérer le délai de transfert et estimer la valeur avant de construire l'agent. {guidance}",
      captured: "Merci. J'ai capturé ces informations et je peux les transmettre à l'équipe SmartDigitalMinds.",
      endpointError: "Je n'ai pas pu joindre l'endpoint du chat. Veuillez écrire à luis.ramirez@opencloud.es avec le flux de travail et le marché."
    },
    footer: {
      body: "SmartDigitalMinds conçoit et exploite des agents métier centrés sur la valeur de l'automatisation."
    },
    mail: {
      auditSubject: "Audit d'agents SmartDigitalMinds"
    },
    markets: {
      us: {
        label: "États-Unis",
        whatsappMessage: "Bonjour SmartDigitalMinds, je souhaite un audit d'agents pour une entreprise aux États-Unis.",
        complianceNote: "Activer seulement après approbation du numéro WhatsApp US et du parcours d'opt-in."
      },
      spain: {
        label: "Espagne / Europe",
        whatsappMessage: "Bonjour SmartDigitalMinds, je souhaite un audit d'agents pour mon entreprise.",
        complianceNote: "Utiliser WhatsApp entrant avec permission, QR ou opt-in explicite sur le site."
      },
      uae: {
        label: "EAU",
        whatsappMessage: "Bonjour SmartDigitalMinds, je souhaite un audit d'agents pour une entreprise aux EAU.",
        complianceNote: "Garder l'envoi sortant désactivé jusqu'à ce que l'entité, l'adresse, le numéro et l'opt-in EAU soient prêts."
      },
      pendingUaeEntity: "Entité EAU en attente"
    }
  },
  de: {
    locale: "de-DE",
    htmlLang: "de-DE",
    meta: {
      title: "SmartDigitalMinds | KI-Agenten für Geschäftsabläufe",
      description: "SmartDigitalMinds entwickelt und betreibt KI-Agenten, die Geschäftsabläufe unterstützen, Automatisierung verbessern und sich auf messbaren Wert konzentrieren."
    },
    language: {
      selectorAria: "Sprachauswahl"
    },
    brand: {
      home: "SmartDigitalMinds Startseite"
    },
    nav: {
      aria: "Hauptnavigation",
      agents: "Agenten",
      run: "Betriebsmodell",
      whatsapp: "WhatsApp",
      value: "Wert",
      contact: "Kontakt"
    },
    hero: {
      eyebrow: "KI-Agenten für Geschäftsabläufe",
      lead: "Wir entwickeln und betreiben praktische KI-Agenten für Abläufe, in denen Geschwindigkeit, Nachverfolgung, Reporting und Verlässlichkeit messbaren Geschäftswert schaffen.",
      primaryCta: "Agenten-Audit anfragen",
      secondaryCta: "Wert schätzen",
      actionsAria: "Primäre Aktionen"
    },
    focus: {
      selectorAria: "Auswahl des Agentenfokus",
      tabsAria: "Agentenfokus",
      tabs: {
        leads: "Lead-Reaktion",
        ops: "Abläufe",
        insight: "Management-Einblick"
      },
      messages: {
        leads: "Erster Gewinn: Verzögerungen bei verpassten Anrufen reduzieren und Anfragen zurückholen, die sonst verschwinden.",
        ops: "Erster Gewinn: wiederholte Admin-Schritte entfernen und dem Team klare Eskalationswege geben.",
        insight: "Erster Gewinn: tägliche Aktivität in eine wöchentliche Entscheidungsansicht für Führungskräfte verwandeln."
      }
    },
    intro: {
      eyebrow: "Für Wert gebaut, nicht für Neuheit",
      title: "Agenten, die zur bestehenden Arbeitsweise des Unternehmens passen.",
      cards: [
        {
          title: "Die Schwachstelle im Ablauf finden",
          body: "Wir beginnen dort, wo Verzögerungen, doppelte Arbeit, verpasste Nachverfolgung und unklare Zuständigkeit Geld kosten."
        },
        {
          title: "Das Agentensystem bauen",
          body: "Agenten verbinden Eingang, Daten, Nachrichten, Freigaben und Reporting-Schritte, die Verlässlichkeit brauchen."
        },
        {
          title: "Betreiben und verbessern",
          body: "Wir halten das System überwacht, gemessen und angepasst, während reale Nutzung zeigt, was Wert schafft."
        }
      ]
    },
    agents: {
      eyebrow: "Was wir bauen",
      title: "Geschäftsagenten für die Arbeit zwischen Kunde, Team und Zahlen.",
      cards: [
        {
          title: "Agenten für Lead-Eingang",
          body: "Erfassen neue Anfragen, verpasste Anrufe, Angebotswünsche, Website-Formulare und Übergaben, bevor sie kalt werden."
        },
        {
          title: "Follow-up-Agenten",
          body: "Senden rechtzeitige Erinnerungen, Bewertungsanfragen, Statusupdates und nächste Schritte nach klaren Regeln."
        },
        {
          title: "Backoffice-Agenten",
          body: "Reduzieren wiederholte Admin-Arbeit bei Planung, Datenbereinigung, Zusammenfassungen, Routing und internen Anfragen."
        },
        {
          title: "Reporting-Agenten",
          body: "Verwandeln Aktivität in wöchentliche Zahlen, Warnungen und praktische Empfehlungen für Manager und Inhaber."
        }
      ]
    },
    run: {
      eyebrow: "Bauen und betreiben",
      title: "Der Agent ist nur nützlich, wenn er nach dem Start weiter funktioniert.",
      body: "SmartDigitalMinds behandelt Agenten als operative Ebene. Wir definieren den Ablauf, bauen die Automatisierung, überwachen Ergebnisse und verfeinern das System anhand des Werts, den es erzeugen soll.",
      steps: [
        {
          label: "Abbilden",
          body: "Ablauf, Daten, Entscheidungspunkte und Verantwortliche."
        },
        {
          label: "Bauen",
          body: "Agentenverhalten, Integrationen, Nachrichten und Reporting."
        },
        {
          label: "Betreiben",
          body: "Monitoring, Qualitätschecks und Eskalationswege."
        },
        {
          label: "Verbessern",
          body: "Wert messen, Reibung entfernen und nur dort erweitern, wo es sich lohnt."
        }
      ]
    },
    calculator: {
      eyebrow: "Wertrechner",
      title: "Mit dem Business Case beginnen.",
      body: "Ein nützlicher Agent sollte operative Reibung reduzieren oder Umsatz zurückholen. Diese schnelle Schätzung rahmt das erste Ziel.",
      hours: "Gesparte Stunden pro Woche",
      rate: "Geschäftswert pro Stunde",
      leads: "Zurückgewonnene Leads pro Monat",
      leadValue: "Durchschnittlicher Lead-Wert",
      result: "Geschätzter Monatswert"
    },
    whatsapp: {
      eyebrow: "WhatsApp-Integration",
      title: "Eine Agentenebene, drei Marktkanäle.",
      body: "WhatsApp kann jetzt eingehende Audit-Anfragen empfangen und später mit Metas Business Platform für agentengestützte Antworten, Vorlagen, Übergaben und Reporting verbunden werden. Nummern und Konto-IDs werden über die Konfiguration delegiert, sodass die Seite bereit ist, bevor die Kanäle live sind.",
      loadingStatus: "Märkte werden geladen",
      loadingTitle: "WhatsApp-Kanäle",
      loadingBody: "Die Marktkonfiguration wird geladen.",
      flowAria: "WhatsApp-Agentenfluss",
      flow: ["Eingehendes Opt-in", "Markt-Routing", "Agenten-Triage", "Menschliche Übergabe", "Wert-Reporting"],
      defaultMessage: "Hallo SmartDigitalMinds, ich möchte ein Agenten-Audit für mein Unternehmen.",
      statusReady: "Bereit für eingehendes WhatsApp",
      statusPending: "Nummer ausstehend",
      phonePending: "Delegiert in whatsapp.config.js",
      accountPending: "Konto-ID ausstehend",
      phoneIdPending: "Telefonnummer-ID ausstehend",
      detailsBusiness: "Unternehmen",
      detailsNumber: "WhatsApp-Nummer",
      detailsAccount: "Business-Konto",
      detailsPhoneId: "Telefonnummer-ID",
      openAction: "WhatsApp öffnen",
      waitingAction: "Warten auf Nummer"
    },
    sectors: {
      eyebrow: "Wo anfangen",
      title: "Gute erste Abläufe sind sichtbar, wiederholbar und messbar.",
      items: [
        "Eingang lokaler Services",
        "Angebots-Follow-up",
        "Bewertungsanfragen",
        "Terminerinnerungen",
        "Wöchentliche Managementberichte",
        "Internes Aufgaben-Routing"
      ]
    },
    contact: {
      eyebrow: "Nächster Schritt",
      title: "Einen Ablauf auswählen und seinen Wert sichtbar machen.",
      body: "Senden Sie den Ablauf, die aktuellen Tools und wo Verzögerung oder verlorener Wert entsteht."
    },
    chat: {
      rootAria: "SmartDigitalMinds Chat-Assistent",
      toggle: "Agentenchat",
      assistantName: "SmartDigitalMinds Assistent",
      statusDemo: "Demo-Modus",
      statusLive: "Live-Agent-Endpunkt",
      closeAria: "Chat schließen",
      market: "Markt",
      marketAria: "Markt auswählen",
      need: "Bedarf",
      intentAria: "Thema auswählen",
      intents: {
        "agent-audit": "Agenten-Audit",
        "lead-followup": "Lead-Follow-up",
        operations: "Betriebsautomatisierung",
        whatsapp: "WhatsApp-Integration"
      },
      messageLabel: "Nachricht",
      placeholder: "Beschreiben Sie den Ablauf, den Sie verbessern möchten",
      send: "Senden",
      note: "Aus diesem Chat wird kein Outreach und keine WhatsApp-Nachricht gesendet, außer ein Live-Backend ist konfiguriert.",
      initialMessage: "Hallo. Ich kann helfen, ein Agenten-Audit, einen Lead-Follow-up-Ablauf, Betriebsautomatisierung oder eine WhatsApp-Integration zu skizzieren.",
      quickReplies: {
        "agent-audit": "Für ein Agenten-Audit teilen Sie bitte Ablauf, aktuelle Tools, Wochenvolumen und Stellen mit Verzögerungen.",
        "lead-followup": "Für Lead-Follow-up teilen Sie bitte Lead-Quellen, durchschnittliche Antwortzeit, Volumen verpasster Anrufe und aktuellen Übergabeprozess.",
        operations: "Für Betriebsautomatisierung teilen Sie bitte die wiederholte Aufgabe, den Verantwortlichen, aktuelle Tools und das gewünschte Ergebnis.",
        whatsapp: "Für WhatsApp teilen Sie bitte Markt, Opt-in-Quelle, erwartete Nachrichtentypen und ob die Geschäftsnummer bereits genehmigt ist."
      },
      shortPromptSuffix: "Sie können mit einem Satz zum Unternehmen und zum Ablauf beginnen.",
      longPrompt: "Für {marketLabel} würde ich zuerst den aktuellen Ablauf abbilden, die Übergabeverzögerung identifizieren und den Wert schätzen, bevor der Agent gebaut wird. {guidance}",
      captured: "Danke. Ich habe das erfasst und kann es an das SmartDigitalMinds-Team weiterleiten.",
      endpointError: "Ich konnte den Chat-Endpunkt nicht erreichen. Bitte schreiben Sie an luis.ramirez@opencloud.es mit Ablauf und Markt."
    },
    footer: {
      body: "SmartDigitalMinds entwickelt und betreibt Geschäftsagenten mit Fokus auf Automatisierungswert."
    },
    mail: {
      auditSubject: "SmartDigitalMinds Agenten-Audit"
    },
    markets: {
      us: {
        label: "Vereinigte Staaten",
        whatsappMessage: "Hallo SmartDigitalMinds, ich möchte ein Agenten-Audit für ein US-Unternehmen.",
        complianceNote: "Erst aktivieren, wenn die US-WhatsApp-Nummer und der Opt-in-Weg genehmigt sind."
      },
      spain: {
        label: "Spanien / Europa",
        whatsappMessage: "Hallo SmartDigitalMinds, ich möchte ein Agenten-Audit für mein Unternehmen.",
        complianceNote: "Eingehendes WhatsApp nur mit vorheriger Erlaubnis, QR oder ausdrücklichem Website-Opt-in nutzen."
      },
      uae: {
        label: "VAE",
        whatsappMessage: "Hallo SmartDigitalMinds, ich möchte ein Agenten-Audit für ein Unternehmen in den VAE.",
        complianceNote: "Ausgehende Nachrichten deaktiviert lassen, bis VAE-Entität, Adresse, Nummer und Opt-in bereit sind."
      },
      pendingUaeEntity: "VAE-Entität ausstehend"
    }
  },
  it: {
    locale: "it-IT",
    htmlLang: "it-IT",
    meta: {
      title: "SmartDigitalMinds | Operazioni con agenti per il business",
      description: "SmartDigitalMinds crea e gestisce agenti IA che supportano le operazioni aziendali, migliorano l'automazione e si concentrano su valore misurabile."
    },
    language: {
      selectorAria: "Selettore lingua"
    },
    brand: {
      home: "Home SmartDigitalMinds"
    },
    nav: {
      aria: "Navigazione principale",
      agents: "Agenti",
      run: "Modello operativo",
      whatsapp: "WhatsApp",
      value: "Valore",
      contact: "Contatto"
    },
    hero: {
      eyebrow: "Operazioni con agenti per il business",
      lead: "Creiamo e gestiamo agenti IA pratici per i flussi di lavoro in cui velocità, follow-up, reporting e coerenza creano valore aziendale misurabile.",
      primaryCta: "Richiedi un audit agenti",
      secondaryCta: "Stima il valore",
      actionsAria: "Azioni principali"
    },
    focus: {
      selectorAria: "Selettore focus agente",
      tabsAria: "Focus agente",
      tabs: {
        leads: "Risposta ai lead",
        ops: "Operazioni",
        insight: "Visione gestionale"
      },
      messages: {
        leads: "Primo risultato: ridurre il ritardo sulle chiamate perse e recuperare richieste che di solito spariscono.",
        ops: "Primo risultato: eliminare passaggi amministrativi ripetuti e dare al team un percorso chiaro di escalation.",
        insight: "Primo risultato: trasformare l'attività quotidiana in una vista decisionale settimanale per i manager."
      }
    },
    intro: {
      eyebrow: "Costruiti per il valore, non per la novità",
      title: "Agenti che si adattano al modo in cui l'azienda lavora già.",
      cards: [
        {
          title: "Trovare la perdita nel flusso di lavoro",
          body: "Partiamo da dove ritardi, lavoro duplicato, follow-up mancati e responsabilità poco chiare costano denaro."
        },
        {
          title: "Costruire il sistema di agenti",
          body: "Gli agenti collegano intake, dati, messaggi, approvazioni e reporting che richiedono coerenza."
        },
        {
          title: "Gestirlo e migliorarlo",
          body: "Manteniamo il sistema monitorato, misurato e adattato mentre l'uso reale mostra cosa crea valore."
        }
      ]
    },
    agents: {
      eyebrow: "Cosa costruiamo",
      title: "Agenti business per il lavoro tra cliente, team e numeri.",
      cards: [
        {
          title: "Agenti di intake lead",
          body: "Catturano nuove richieste, chiamate perse, richieste di preventivo, moduli web e passaggi prima che si raffreddino."
        },
        {
          title: "Agenti di follow-up",
          body: "Inviano promemoria, richieste di recensione, aggiornamenti di stato e messaggi di prossimo passo con regole chiare."
        },
        {
          title: "Agenti di back office",
          body: "Riducono il lavoro amministrativo ripetuto su agenda, pulizia dati, riepiloghi, routing e richieste interne."
        },
        {
          title: "Agenti di reporting",
          body: "Trasformano l'attività in numeri settimanali, avvisi e raccomandazioni pratiche per manager e titolari."
        }
      ]
    },
    run: {
      eyebrow: "Costruire e gestire",
      title: "L'agente è utile solo quando continua a funzionare dopo il lancio.",
      body: "SmartDigitalMinds tratta gli agenti come un livello operativo. Definiamo il flusso di lavoro, costruiamo l'automazione, monitoriamo i risultati e perfezioniamo il sistema rispetto al valore che deve produrre.",
      steps: [
        {
          label: "Mappare",
          body: "Flusso di lavoro, dati, decisioni e responsabile."
        },
        {
          label: "Costruire",
          body: "Comportamento agente, integrazioni, messaggi e reporting."
        },
        {
          label: "Gestire",
          body: "Monitoraggio, controlli qualità e percorsi di escalation."
        },
        {
          label: "Migliorare",
          body: "Misurare valore, rimuovere attrito ed espandere solo dove conviene."
        }
      ]
    },
    calculator: {
      eyebrow: "Calcolatore di valore",
      title: "Parti dal caso di business.",
      body: "Un agente utile deve ridurre l'attrito operativo o recuperare ricavi. Questa stima rapida inquadra il primo obiettivo.",
      hours: "Ore risparmiate a settimana",
      rate: "Valore aziendale orario",
      leads: "Lead recuperati al mese",
      leadValue: "Valore medio del lead",
      result: "Valore mensile stimato"
    },
    whatsapp: {
      eyebrow: "Integrazione WhatsApp",
      title: "Un livello di agenti, tre canali di mercato.",
      body: "WhatsApp può ricevere ora richieste di audit in ingresso e in seguito collegarsi alla Business Platform di Meta per risposte assistite da agenti, template, passaggi e reporting. Numeri e ID account sono delegati tramite configurazione, quindi la pagina è pronta prima che i canali siano attivi.",
      loadingStatus: "Caricamento mercati",
      loadingTitle: "Canali WhatsApp",
      loadingBody: "La configurazione del mercato è in caricamento.",
      flowAria: "Flusso agente WhatsApp",
      flow: ["Opt-in in ingresso", "Routing per mercato", "Triage agente", "Passaggio umano", "Reporting del valore"],
      defaultMessage: "Ciao SmartDigitalMinds, vorrei un audit agenti per la mia azienda.",
      statusReady: "Pronto per WhatsApp in ingresso",
      statusPending: "Numero in sospeso",
      phonePending: "Delegato in whatsapp.config.js",
      accountPending: "ID account in sospeso",
      phoneIdPending: "ID numero in sospeso",
      detailsBusiness: "Azienda",
      detailsNumber: "Numero WhatsApp",
      detailsAccount: "Account Business",
      detailsPhoneId: "ID numero",
      openAction: "Apri WhatsApp",
      waitingAction: "In attesa del numero"
    },
    sectors: {
      eyebrow: "Da dove iniziare",
      title: "I buoni primi flussi di lavoro sono visibili, ripetitivi e misurabili.",
      items: [
        "Intake servizi locali",
        "Follow-up preventivi",
        "Richieste di recensione",
        "Promemoria appuntamenti",
        "Report gestionali settimanali",
        "Routing attività interne"
      ]
    },
    contact: {
      eyebrow: "Prossimo passo",
      title: "Scegli un flusso di lavoro e rendi evidente il suo valore.",
      body: "Invia il flusso di lavoro, gli strumenti attuali e dove compare il ritardo o il valore perso."
    },
    chat: {
      rootAria: "Assistente chat SmartDigitalMinds",
      toggle: "Chat agente",
      assistantName: "Assistente SmartDigitalMinds",
      statusDemo: "Modalità demo",
      statusLive: "Endpoint agente attivo",
      closeAria: "Chiudi chat",
      market: "Mercato",
      marketAria: "Seleziona mercato",
      need: "Esigenza",
      intentAria: "Seleziona argomento",
      intents: {
        "agent-audit": "Audit agenti",
        "lead-followup": "Follow-up lead",
        operations: "Automazione operativa",
        whatsapp: "Integrazione WhatsApp"
      },
      messageLabel: "Messaggio",
      placeholder: "Raccontaci il flusso di lavoro che vuoi migliorare",
      send: "Invia",
      note: "Da questa chat non viene inviato alcun outreach o messaggio WhatsApp salvo configurazione di un backend attivo.",
      initialMessage: "Ciao. Posso aiutare a definire un audit agenti, un flusso di follow-up lead, automazione operativa o integrazione WhatsApp.",
      quickReplies: {
        "agent-audit": "Per un audit agenti, condividi il flusso di lavoro, gli strumenti attuali, il volume settimanale e dove compaiono i ritardi.",
        "lead-followup": "Per il follow-up lead, condividi fonti dei lead, tempo medio di risposta, volume di chiamate perse e processo attuale di passaggio.",
        operations: "Per l'automazione operativa, condividi l'attività ripetitiva, chi la gestisce, strumenti attuali e cosa rende il risultato riuscito.",
        whatsapp: "Per WhatsApp, condividi il mercato, la fonte di opt-in, i tipi di messaggi previsti e se il numero aziendale è già approvato."
      },
      shortPromptSuffix: "Puoi iniziare con una frase sull'azienda e sul flusso di lavoro.",
      longPrompt: "Per {marketLabel}, inizierei mappando il flusso attuale, identificando il ritardo nel passaggio e stimando il valore prima di costruire l'agente. {guidance}",
      captured: "Grazie. Ho registrato queste informazioni e posso indirizzarle al team SmartDigitalMinds.",
      endpointError: "Non sono riuscito a raggiungere l'endpoint della chat. Scrivi a luis.ramirez@opencloud.es con il flusso di lavoro e il mercato."
    },
    footer: {
      body: "SmartDigitalMinds crea e gestisce agenti business focalizzati sul valore dell'automazione."
    },
    mail: {
      auditSubject: "Audit agenti SmartDigitalMinds"
    },
    markets: {
      us: {
        label: "Stati Uniti",
        whatsappMessage: "Ciao SmartDigitalMinds, vorrei un audit agenti per un'azienda negli Stati Uniti.",
        complianceNote: "Attivare solo dopo l'approvazione del numero WhatsApp USA e del percorso di opt-in."
      },
      spain: {
        label: "Spagna / Europa",
        whatsappMessage: "Ciao SmartDigitalMinds, vorrei un audit agenti per la mia azienda.",
        complianceNote: "Usare WhatsApp in ingresso con permesso, QR o opt-in esplicito sul sito."
      },
      uae: {
        label: "EAU",
        whatsappMessage: "Ciao SmartDigitalMinds, vorrei un audit agenti per un'azienda negli EAU.",
        complianceNote: "Mantenere disabilitati i messaggi in uscita finché entità, indirizzo, numero e opt-in EAU non sono pronti."
      },
      pendingUaeEntity: "Entità EAU in sospeso"
    }
  }
};

const textBindings = [
  [".site-nav a[href='#agents']", "nav.agents"],
  [".site-nav a[href='#run']", "nav.run"],
  [".site-nav a[href='#whatsapp']", "nav.whatsapp"],
  [".site-nav a[href='#value']", "nav.value"],
  [".site-nav a[href='#contact']", "nav.contact"],
  [".hero .eyebrow", "hero.eyebrow"],
  [".hero__lead", "hero.lead"],
  [".hero__actions .button--primary", "hero.primaryCta"],
  [".hero__actions .button--ghost", "hero.secondaryCta"],
  [".focus-tab[data-focus='leads']", "focus.tabs.leads"],
  [".focus-tab[data-focus='ops']", "focus.tabs.ops"],
  [".focus-tab[data-focus='insight']", "focus.tabs.insight"],
  [".intro .section__heading .eyebrow", "intro.eyebrow"],
  ["#intro-title", "intro.title"],
  [".intro__grid article:nth-child(1) h3", "intro.cards.0.title"],
  [".intro__grid article:nth-child(1) p", "intro.cards.0.body"],
  [".intro__grid article:nth-child(2) h3", "intro.cards.1.title"],
  [".intro__grid article:nth-child(2) p", "intro.cards.1.body"],
  [".intro__grid article:nth-child(3) h3", "intro.cards.2.title"],
  [".intro__grid article:nth-child(3) p", "intro.cards.2.body"],
  ["#agents .section__heading .eyebrow", "agents.eyebrow"],
  ["#agents-title", "agents.title"],
  [".agent-grid .agent-card:nth-child(1) h3", "agents.cards.0.title"],
  [".agent-grid .agent-card:nth-child(1) p", "agents.cards.0.body"],
  [".agent-grid .agent-card:nth-child(2) h3", "agents.cards.1.title"],
  [".agent-grid .agent-card:nth-child(2) p", "agents.cards.1.body"],
  [".agent-grid .agent-card:nth-child(3) h3", "agents.cards.2.title"],
  [".agent-grid .agent-card:nth-child(3) p", "agents.cards.2.body"],
  [".agent-grid .agent-card:nth-child(4) h3", "agents.cards.3.title"],
  [".agent-grid .agent-card:nth-child(4) p", "agents.cards.3.body"],
  ["#run .eyebrow", "run.eyebrow"],
  ["#run-title", "run.title"],
  ["#run .section-copy", "run.body"],
  [".run-steps li:nth-child(1) span", "run.steps.0.label"],
  [".run-steps li:nth-child(1) strong", "run.steps.0.body"],
  [".run-steps li:nth-child(2) span", "run.steps.1.label"],
  [".run-steps li:nth-child(2) strong", "run.steps.1.body"],
  [".run-steps li:nth-child(3) span", "run.steps.2.label"],
  [".run-steps li:nth-child(3) strong", "run.steps.2.body"],
  [".run-steps li:nth-child(4) span", "run.steps.3.label"],
  [".run-steps li:nth-child(4) strong", "run.steps.3.body"],
  ["#value .eyebrow", "calculator.eyebrow"],
  ["#value-title", "calculator.title"],
  ["#value .section-copy", "calculator.body"],
  [".calculator .range-field:nth-of-type(1) > span", "calculator.hours"],
  [".calculator .range-field:nth-of-type(2) > span", "calculator.rate"],
  [".calculator .range-field:nth-of-type(3) > span", "calculator.leads"],
  [".calculator .range-field:nth-of-type(4) > span", "calculator.leadValue"],
  [".calculator__result > span", "calculator.result"],
  ["#whatsapp .eyebrow", "whatsapp.eyebrow"],
  ["#whatsapp-title", "whatsapp.title"],
  ["#whatsapp .section-copy", "whatsapp.body"],
  [".whatsapp-grid > .whatsapp-card .whatsapp-card__status", "whatsapp.loadingStatus"],
  [".whatsapp-grid > .whatsapp-card h3", "whatsapp.loadingTitle"],
  [".whatsapp-grid > .whatsapp-card p", "whatsapp.loadingBody"],
  [".whatsapp-flow span:nth-child(1)", "whatsapp.flow.0"],
  [".whatsapp-flow span:nth-child(2)", "whatsapp.flow.1"],
  [".whatsapp-flow span:nth-child(3)", "whatsapp.flow.2"],
  [".whatsapp-flow span:nth-child(4)", "whatsapp.flow.3"],
  [".whatsapp-flow span:nth-child(5)", "whatsapp.flow.4"],
  [".sectors .eyebrow", "sectors.eyebrow"],
  ["#sectors-title", "sectors.title"],
  [".sector-list span:nth-child(1)", "sectors.items.0"],
  [".sector-list span:nth-child(2)", "sectors.items.1"],
  [".sector-list span:nth-child(3)", "sectors.items.2"],
  [".sector-list span:nth-child(4)", "sectors.items.3"],
  [".sector-list span:nth-child(5)", "sectors.items.4"],
  [".sector-list span:nth-child(6)", "sectors.items.5"],
  ["#contact .eyebrow", "contact.eyebrow"],
  ["#contact-title", "contact.title"],
  [".contact__actions p", "contact.body"],
  [".chatbot__toggle > span:last-child", "chat.toggle"],
  [".chatbot__header strong", "chat.assistantName"],
  [".chatbot__controls label:nth-child(1) > span", "chat.market"],
  [".chatbot__controls label:nth-child(2) > span", "chat.need"],
  ["select[data-chat-intent] option[value='agent-audit']", "chat.intents.agent-audit"],
  ["select[data-chat-intent] option[value='lead-followup']", "chat.intents.lead-followup"],
  ["select[data-chat-intent] option[value='operations']", "chat.intents.operations"],
  ["select[data-chat-intent] option[value='whatsapp']", "chat.intents.whatsapp"],
  ["label[for='chatbot-message']", "chat.messageLabel"],
  [".chatbot__form button", "chat.send"],
  [".chatbot__note", "chat.note"],
  [".site-footer p", "footer.body"]
];

const attributeBindings = [
  [".brand", "aria-label", "brand.home"],
  [".site-nav", "aria-label", "nav.aria"],
  ["[data-language-select]", "aria-label", "language.selectorAria"],
  [".hero__actions", "aria-label", "hero.actionsAria"],
  [".focus-strip", "aria-label", "focus.selectorAria"],
  [".focus-strip__tabs", "aria-label", "focus.tabsAria"],
  [".whatsapp-flow", "aria-label", "whatsapp.flowAria"],
  ["[data-chatbot]", "aria-label", "chat.rootAria"],
  ["[data-chat-close]", "aria-label", "chat.closeAria"],
  ["[data-chat-market]", "aria-label", "chat.marketAria"],
  ["[data-chat-intent]", "aria-label", "chat.intentAria"],
  ["#chatbot-message", "placeholder", "chat.placeholder"]
];

let currentLanguage = getInitialLanguage();
let chatbotRefs = null;

function normalizeLanguage(language) {
  return supportedLanguages.includes(language) ? language : "en";
}

function getLanguageFromTag(languageTag) {
  const tag = String(languageTag || "").trim();
  if (!tag) return null;

  const normalized = tag.replace("_", "-").toLowerCase();
  const baseLanguage = normalized.split("-")[0];
  if (supportedLanguages.includes(baseLanguage)) {
    return baseLanguage;
  }

  const region = normalized.split("-")[1]?.toUpperCase();
  return regionLanguageMap[region] || null;
}

function getLanguageFromBrowserPreferences() {
  const browserLanguages = Array.isArray(navigator.languages) && navigator.languages.length
    ? navigator.languages
    : [navigator.language];

  for (const languageTag of browserLanguages) {
    const language = getLanguageFromTag(languageTag);
    if (language) return language;
  }

  try {
    return getLanguageFromTag(new Intl.DateTimeFormat().resolvedOptions().locale);
  } catch (error) {
    return null;
  }
}

function getLanguageFromLocationHint() {
  try {
    const timeZone = new Intl.DateTimeFormat().resolvedOptions().timeZone;
    return timezoneLanguageMap[timeZone] || null;
  } catch (error) {
    return null;
  }
}

function getStoredLanguage() {
  let storedLanguage = null;

  try {
    storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  } catch (error) {
    storedLanguage = null;
  }

  if (supportedLanguages.includes(storedLanguage)) {
    return storedLanguage;
  }

  return null;
}

function getInitialLanguage() {
  return getStoredLanguage()
    || getLanguageFromBrowserPreferences()
    || getLanguageFromLocationHint()
    || "en";
}

function getCopy(language = currentLanguage) {
  return translations[normalizeLanguage(language)] || translations.en;
}

function getValue(path, source = getCopy()) {
  return path.split(".").reduce((value, key) => {
    if (value === undefined || value === null) return undefined;
    return value[key];
  }, source);
}

function translate(path, replacements = {}) {
  const value = getValue(path) ?? getValue(path, translations.en);

  if (typeof value !== "string") {
    return "";
  }

  return value.replace(/\{(\w+)\}/g, (match, key) => {
    return Object.prototype.hasOwnProperty.call(replacements, key) ? replacements[key] : match;
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };

    return entities[character];
  });
}

function formatCurrency(value) {
  return new Intl.NumberFormat(getCopy().locale, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

function getMarketCopy(marketId) {
  return getValue(`markets.${marketId}`) || getValue(`markets.${marketId}`, translations.en) || {};
}

function getMarketLabel(market) {
  return getMarketCopy(market.id).label || market.label;
}

function getLegalEntityLabel(market) {
  if (market.legalEntity === "Pending UAE entity") {
    return translate("markets.pendingUaeEntity");
  }

  return market.legalEntity;
}

function setText(selector, key) {
  document.querySelectorAll(selector).forEach((element) => {
    element.textContent = translate(key);
  });
}

function setAttribute(selector, attribute, key) {
  document.querySelectorAll(selector).forEach((element) => {
    element.setAttribute(attribute, translate(key));
  });
}

function applyStaticTranslations() {
  document.documentElement.lang = getCopy().htmlLang || currentLanguage;
  document.title = translate("meta.title");

  const description = document.querySelector("meta[name='description']");
  if (description) {
    description.setAttribute("content", translate("meta.description"));
  }

  textBindings.forEach(([selector, key]) => setText(selector, key));
  attributeBindings.forEach(([selector, attribute, key]) => setAttribute(selector, attribute, key));
}

function updateLanguageControl() {
  document.querySelectorAll("[data-language-select]").forEach((select) => {
    select.value = currentLanguage;
  });
}

function updateMailLinks() {
  const subject = encodeURIComponent(translate("mail.auditSubject"));

  document.querySelectorAll('a[href^="mailto:agent@smartdigitalminds.com"]').forEach((link) => {
    link.href = `mailto:agent@smartdigitalminds.com?subject=${subject}`;
  });
}

function updateFocusResult() {
  const active = document.querySelector(".focus-tab.is-active");
  const result = document.querySelector("[data-focus-result]");

  if (!active || !result) return;

  result.textContent = translate(`focus.messages.${active.dataset.focus}`);
}

function applyLanguage(language, options = {}) {
  currentLanguage = normalizeLanguage(language);

  if (options.persist !== false) {
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLanguage);
    } catch (error) {
      // Browsers can deny storage in private contexts; the page still works.
    }
  }

  applyStaticTranslations();
  updateLanguageControl();
  updateMailLinks();
  updateFocusResult();
  renderWhatsAppMarkets();
  syncChatbotCopy();

  document.querySelectorAll("[data-calculator]").forEach(updateCalculator);
}

function cleanWhatsAppNumber(phoneNumber) {
  return String(phoneNumber || "").replace(/[^\d]/g, "");
}

function isWhatsAppMarketReady(market) {
  return cleanWhatsAppNumber(market.phoneNumberE164).length >= 8;
}

function buildWhatsAppUrl(market) {
  const phone = cleanWhatsAppNumber(market.phoneNumberE164);
  const message = encodeURIComponent(getMarketCopy(market.id).whatsappMessage || translate("whatsapp.defaultMessage"));
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

  result.textContent = translate(`focus.messages.${selected.dataset.focus}`);
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
  form.querySelector('[data-output="rate"]').textContent = formatCurrency(rate);
  form.querySelector('[data-output="leads"]').textContent = String(leads);
  form.querySelector('[data-output="leadValue"]').textContent = formatCurrency(leadValue);
  form.querySelector("[data-total]").textContent = formatCurrency(total);
}

function renderWhatsAppMarkets() {
  const mount = document.querySelector("[data-whatsapp-markets]");
  const config = window.SDM_WHATSAPP_CONFIG;
  if (!mount || !config?.markets?.length) return;

  mount.innerHTML = config.markets.map((market) => {
    const ready = isWhatsAppMarketReady(market);
    const status = ready ? translate("whatsapp.statusReady") : translate("whatsapp.statusPending");
    const phoneLabel = market.phoneNumberE164 || translate("whatsapp.phonePending");
    const accountLabel = market.whatsappBusinessAccountId || translate("whatsapp.accountPending");
    const phoneIdLabel = market.phoneNumberId || translate("whatsapp.phoneIdPending");
    const marketCopy = getMarketCopy(market.id);
    const complianceNote = marketCopy.complianceNote || market.complianceNote;
    const action = ready
      ? `<a class="button button--primary whatsapp-card__button" href="${escapeHtml(buildWhatsAppUrl(market))}" target="_blank" rel="noopener">${escapeHtml(translate("whatsapp.openAction"))}</a>`
      : `<span class="button whatsapp-card__button is-disabled" aria-disabled="true">${escapeHtml(translate("whatsapp.waitingAction"))}</span>`;

    return `
      <article class="whatsapp-card" data-market="${escapeHtml(market.id)}">
        <span class="whatsapp-card__status ${ready ? "is-ready" : ""}">${escapeHtml(status)}</span>
        <h3>${escapeHtml(getMarketLabel(market))}</h3>
        <dl class="whatsapp-card__details">
          <div>
            <dt>${escapeHtml(translate("whatsapp.detailsBusiness"))}</dt>
            <dd>${escapeHtml(getLegalEntityLabel(market))}</dd>
          </div>
          <div>
            <dt>${escapeHtml(translate("whatsapp.detailsNumber"))}</dt>
            <dd>${escapeHtml(phoneLabel)}</dd>
          </div>
          <div>
            <dt>${escapeHtml(translate("whatsapp.detailsAccount"))}</dt>
            <dd>${escapeHtml(accountLabel)}</dd>
          </div>
          <div>
            <dt>${escapeHtml(translate("whatsapp.detailsPhoneId"))}</dt>
            <dd>${escapeHtml(phoneIdLabel)}</dd>
          </div>
        </dl>
        <p>${escapeHtml(complianceNote)}</p>
        ${action}
      </article>
    `;
  }).join("");
}

function appendChatMessage(container, role, text, options = {}) {
  const message = document.createElement("div");
  message.className = `chatbot-message chatbot-message--${role}`;
  message.textContent = text;

  if (options.initial) {
    message.dataset.initialMessage = "true";
  }

  container.appendChild(message);
  container.scrollTop = container.scrollHeight;
}

function buildDemoChatReply(message, intent, marketLabel) {
  const config = window.SDM_CHATBOT_CONFIG || {};
  const guidance = translate(`chat.quickReplies.${intent}`)
    || config.quickReplies?.[intent]
    || translate("chat.quickReplies.agent-audit");
  const trimmed = message.trim();

  if (trimmed.length < 18) {
    return `${guidance} ${translate("chat.shortPromptSuffix")}`;
  }

  return translate("chat.longPrompt", { marketLabel, guidance });
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

function syncChatbotCopy() {
  if (!chatbotRefs) return;

  const { config, marketSelect, messages, status } = chatbotRefs;

  if (status) {
    status.textContent = config.apiEndpoint && !config.demoMode ? translate("chat.statusLive") : translate("chat.statusDemo");
  }

  if (marketSelect) {
    const selectedMarket = marketSelect.value;
    marketSelect.innerHTML = config.markets.map((market) => {
      return `<option value="${escapeHtml(market.id)}">${escapeHtml(getMarketLabel(market))}</option>`;
    }).join("");

    if (selectedMarket && config.markets.some((market) => market.id === selectedMarket)) {
      marketSelect.value = selectedMarket;
    }
  }

  const initialMessage = messages?.querySelector("[data-initial-message]");
  const hasUserMessages = Boolean(messages?.querySelector(".chatbot-message--user"));

  if (initialMessage && !hasUserMessages) {
    initialMessage.textContent = translate("chat.initialMessage");
  }
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

  chatbotRefs = {
    config,
    marketSelect,
    messages,
    status
  };

  syncChatbotCopy();
  appendChatMessage(messages, "assistant", translate("chat.initialMessage"), { initial: true });

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
    const marketLabel = getMarketLabel(market);
    appendChatMessage(messages, "user", message);
    input.value = "";
    chatState.isSending = true;
    form.querySelector("button").disabled = true;

    try {
      const payload = {
        source: "website-chat",
        conversationId: chatState.conversationId,
        marketId: market.id,
        marketLabel,
        legalEntity: market.legalEntity,
        intent,
        message,
        page: window.location.pathname,
        language: currentLanguage,
        sentAt: new Date().toISOString()
      };
      const result = await sendChatMessage(payload);
      appendChatMessage(messages, "assistant", result.reply || translate("chat.captured"));
    } catch (error) {
      appendChatMessage(messages, "assistant", translate("chat.endpointError"));
    } finally {
      chatState.isSending = false;
      form.querySelector("button").disabled = false;
      input.focus();
    }
  });
}

const chatState = {
  conversationId: `sdm-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
  isSending: false
};

document.querySelector("[data-language-select]")?.addEventListener("change", (event) => {
  applyLanguage(event.target.value);
});

document.querySelector(".focus-strip")?.addEventListener("click", updateFocus);

document.querySelectorAll("[data-calculator]").forEach((form) => {
  updateCalculator(form);
  form.addEventListener("input", () => updateCalculator(form));
});

renderWhatsAppMarkets();
setupChatbot();
applyLanguage(currentLanguage, { persist: false });
