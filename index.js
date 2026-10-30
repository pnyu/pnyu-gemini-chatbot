import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
import { createApp } from './src/app.js';

const port = Number(process.env.PORT) || 3000;
const model = process.env.GEMINI_MODEL?.trim() || 'gemini-2.5-flash';
const demoMode = String(process.env.DEMO_MODE).toLowerCase() === 'true';
const apiKey = process.env.GEMINI_API_KEY?.trim();
const ai = !demoMode && apiKey ? new GoogleGenAI({ apiKey }) : null;

const app = createApp({
  model,
  demoMode,
  hasApiKey: Boolean(apiKey),
  generate: ai ? (payload) => ai.models.generateContent(payload) : null
});

app.listen(port, () => {
  console.log(`Chatbot siap di http://localhost:${port}`);
  console.log(`Mode: ${demoMode ? 'DEMO (simulasi)' : apiKey ? `GEMINI (${model})` : 'BUTUH API KEY'}`);
  if (!demoMode && !apiKey) console.log('Isi GEMINI_API_KEY dalam .env, lalu jalankan ulang.');
});
