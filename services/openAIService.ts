import { ChatMessage } from '../types';

type OpenAIRole = 'system' | 'user' | 'assistant';

interface OpenAIMessage {
  role: OpenAIRole;
  content: string;
}

const getApiKey = (): string => {
  const maybeProcess = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process;
  const metaEnv = (import.meta as any)?.env ?? {};

  return (
    maybeProcess?.env?.OPENAI_API_KEY ||
    maybeProcess?.env?.API_KEY ||
    metaEnv.OPENAI_API_KEY ||
    metaEnv.VITE_OPENAI_API_KEY ||
    metaEnv.API_KEY ||
    ''
  );
};

const apiKey = getApiKey();
const MODEL = 'gpt-4o-mini';
const CHAT_COMPLETIONS_URL = 'https://api.openai.com/v1/chat/completions';

const callOpenAI = async (messages: OpenAIMessage[], temperature = 0.7): Promise<string> => {
  if (!apiKey) {
    return 'Error: API Key no encontrada. Configura OPENAI_API_KEY en tu archivo .env.local.';
  }

  try {
    const response = await fetch(CHAT_COMPLETIONS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature
      })
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('OpenAI API Error:', errorBody);
      return 'Ocurrió un error al conectar con el servicio de OpenAI.';
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || 'No se pudo generar una respuesta.';
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return 'Ocurrió un error al conectar con el servicio de OpenAI.';
  }
};

const mapHistoryToMessages = (history: ChatMessage[]): OpenAIMessage[] => {
  return history.map((msg) => ({
    role: msg.role === 'model' ? 'assistant' : 'user',
    content: msg.text
  }));
};

export const generateAIResponse = async (
  history: ChatMessage[],
  currentMessage: string,
  documentContext: string = ''
): Promise<string> => {
  const systemInstruction = [
    'Eres un asistente inteligente para estudiantes universitarios.',
    'Eres experto en programación, redacción académica y gestión de tiempo.',
    documentContext
      ? `CONTEXTO DEL DOCUMENTO ACTUAL:\n${documentContext}\nUsa este contexto si es relevante.`
      : ''
  ]
    .filter(Boolean)
    .join('\n\n');

  const messages: OpenAIMessage[] = [
    { role: 'system', content: systemInstruction },
    ...mapHistoryToMessages(history),
    { role: 'user', content: currentMessage }
  ];

  return callOpenAI(messages, 0.7);
};

export const summarizeText = async (text: string): Promise<string> => {
  if (!text.trim()) {
    return 'No hay texto para resumir.';
  }

  const messages: OpenAIMessage[] = [
    { role: 'system', content: 'Eres un asistente que resume textos en 3 puntos claros.' },
    {
      role: 'user',
      content: `Resume el siguiente texto en 3 puntos clave:\n\n${text}`
    }
  ];

  return callOpenAI(messages, 0.4);
};
