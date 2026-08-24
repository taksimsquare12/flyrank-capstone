
import { generateText } from 'ai';
import { CHAT_MODEL, SYSTEM_PROMPT } from '@/lib/ai-config';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = await generateText({
      model: CHAT_MODEL,
      system: SYSTEM_PROMPT,
      messages,
    });

    return new Response(JSON.stringify({ text: result.text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}