import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

try {
  const genAI = new GoogleGenAI({});
  genAI.apiKey = process.env.GOOGLE_AI_API_KEY;
} catch (error) {
  console.error('Error initializing GoogleGenAI:', error);
}