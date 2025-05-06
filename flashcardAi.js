// flashcardAI.js
require('dotenv').config();
const fs = require('fs');
const pdfParse = require('pdf-parse');
const { OpenAI } = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Generate exactly 5 flashcards for a given topic, optionally using a PDF as source.
 * @param {string} topic - The topic to generate flashcards for.
 * @param {string|null} filePath - Local path to a PDF file to use as context, or null.
 * @returns {Promise<Array<{question:string,answer:string}>>}
 */
async function generateFlashcards(topic, filePath = null) {
  let contextText = '';

  // If a PDF path is provided, extract its text
  if (filePath) {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      contextText = pdfData.text.slice(0, 20000);
      console.log('[FLASHCARD_AI] Loaded PDF context, length:', contextText.length);
    } catch (err) {
      console.warn('[FLASHCARD_AI] Failed to parse PDF, falling back to broad context:', err);
      contextText = '';
    }
  }

  // Build messages
  const systemMsg = {
    role: 'system',
    content: filePath
      ? `You are a flashcard generator. Use only the following text as your source for generating flashcards. Text:\n${contextText}`
      : `You are a flashcard generator using a broad general knowledge base.`
  };
  const userMsg = {
    role: 'user',
    content: `Create exactly 5 flashcards for the topic: "${topic}". Respond with a pure JSON array of objects with \"question\" and \"answer\" fields and nothing else.`
  };

  // Call GPT
  const resp = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [systemMsg, userMsg],
    temperature: 0.7,
  });

  const raw = resp.choices[0].message.content.trim();
  console.log('[FLASHCARD_AI] Raw response:', raw);

  // Strip wrappers
  let jsonText = raw;
  const fenceMatch = raw.match(/```(?:json)?([\s\S]*?)```/i);
  if (fenceMatch) {
    jsonText = fenceMatch[1].trim();
  } else if (!raw.startsWith('[')) {
    const start = raw.indexOf('[');
    const end = raw.lastIndexOf(']');
    if (start !== -1 && end !== -1) {
      jsonText = raw.substring(start, end + 1);
    }
  }

  // Parse JSON
  let cards;
  try {
    cards = JSON.parse(jsonText);
  } catch (err) {
    throw new Error(`Failed to parse JSON. Extracted text:\n${jsonText}`);
  }

  // Validate
  if (!Array.isArray(cards) || cards.length !== 5) {
    throw new Error(`Expected an array of 5 cards, got ${cards.length}`);
  }
  cards.forEach((c, i) => {
    if (typeof c.question !== 'string' || typeof c.answer !== 'string') {
      throw new Error(`Card #${i+1} missing proper fields`);
    }
  });

  return cards;
}

module.exports = { generateFlashcards };
