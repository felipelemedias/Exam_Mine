export enum AgentType {
  EXAM_ANALYZER = "exam-analyzer",
  MEDICATION_INFO = "medication-info",
  MEDICATION_PRICES = "medication-prices",
  GENERAL_QUESTION = "general-question"
}

export interface Agent {
  id: AgentType;
  name: string;
  description: string;
  icon: string;
  color: string;
  inputType: "file" | "text" | "none";
  inputPlaceholder?: string;
  fileTypes?: string;
  buttonText: string;
  initialMessage: string;
}

export const AGENTS: Record<AgentType, Agent> = {
  [AgentType.EXAM_ANALYZER]: {
    id: AgentType.EXAM_ANALYZER,
    name: "Análise de Exames",
    description: "Faça upload de um PDF de exame para análise detalhada",
    icon: "/g808-1.png",
    color: "bg-blue-600",
    inputType: "file",
    fileTypes: ".pdf",
    buttonText: "Enviar Exame para Análise",
    initialMessage: "Olá! Sou o assistente de análise de exames. Faça upload do seu exame em PDF para que eu possa analisá-lo."
  },
  [AgentType.MEDICATION_INFO]: {
    id: AgentType.MEDICATION_INFO,
    name: "Consulta de Bulas",
    description: "Informações detalhadas sobre medicamentos",
    icon: "/group-24.png",
    color: "bg-green-500",
    inputType: "text",
    inputPlaceholder: "Digite o nome do medicamento",
    buttonText: "Buscar Informações",
    initialMessage: "Olá! Sou o assistente de consulta de bulas. Digite o nome de um medicamento para obter informações detalhadas."
  },
  [AgentType.MEDICATION_PRICES]: {
    id: AgentType.MEDICATION_PRICES,
    name: "Busca de Remédios",
    description: "Compare preços de medicamentos",
    icon: "/vector-7.svg", 
    color: "bg-blue-500",
    inputType: "text",
    inputPlaceholder: "Digite o nome do medicamento",
    buttonText: "Comparar Preços",
    initialMessage: "Olá! Sou o assistente de busca de preços de medicamentos. Digite o nome de um medicamento para comparar preços."
  },
  [AgentType.GENERAL_QUESTION]: {
    id: AgentType.GENERAL_QUESTION,
    name: "Avaliação de Dúvidas com IA",
    description: "Esclarecimento de dúvidas médicas",
    icon: "/g808-1.png",
    color: "bg-blue-600",
    inputType: "text",
    inputPlaceholder: "Digite sua pergunta sobre saúde",
    buttonText: "Enviar Pergunta",
    initialMessage: "Olá! Sou o assistente de dúvidas médicas. Como posso ajudar você hoje?"
  }
};