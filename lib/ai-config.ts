import { google } from '@ai-sdk/google';

export const CHAT_MODEL = google('gemini-1.5-flash-latest');
export const SYSTEM_PROMPT = 'You are a helpful AI Capstone Assistant.';