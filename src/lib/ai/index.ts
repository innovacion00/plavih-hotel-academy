// Placeholder — Fase 2 will wire real Claude/OpenAI integration

export type AiRole = 'user' | 'assistant'

export type AiChatMessage = {
  role: AiRole
  content: string
  timestamp: string
}

export const HOTEL_SYSTEM_PROMPT = `Eres ValerIA, el asistente de inteligencia artificial de Plavih Hotel Academy.
Ayudas a colaboradores y estudiantes del sector hotelero con preguntas sobre cursos, hospitalidad,
gestión hotelera, atención al cliente y operaciones. Respondes en español con un tono profesional
y amigable. Cuando no sepas algo, lo dices claramente.`

export async function sendAiMessage(
  _messages: AiChatMessage[],
  _userMessage: string
): Promise<string> {
  // TODO Fase 2: Integrate with Claude API (claude-sonnet-4-6)
  return 'Hola, soy ValerIA. La integración con IA estará disponible en la Fase 2. Por ahora, puedes explorar los cursos disponibles en la plataforma.'
}
