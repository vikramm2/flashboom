// flashcardAI.js
require('dotenv').config();
const { OpenAI } = require('openai');

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Generate exactly 5 flashcards for a given topic via GPT-4o.
 * @param {string} topic
 * @returns {Promise<Array<{question:string,answer:string}>>}
 */
async function generateFlashcards(topic) {
  // 1) System and user prompts to enforce JSON-only output
  const systemMsg = {
    role:    'system',
    content: `You are a flashcard generator. Respond with exactly a JSON array of 5 objects, each having "question" and "answer" fields, and no additional text.`
  };
  const userMsg = {
    role:    'user',
    content: `Create exactly 5 flashcards for the topic: "${topic}".`
  };

  // 2) Call GPT-4o
  const resp = await openai.chat.completions.create({
    model:       'gpt-4o',
    messages:    [systemMsg, userMsg],
    temperature: 0.7,
  });

  const raw = resp.choices[0].message.content.trim();

  // 3) Parse JSON
  let cards;
  try {
    cards = JSON.parse(raw);
  } catch (err) {
    throw new Error(`OpenAI returned invalid JSON:\n${raw}`);
  }

  // 4) Validate structure
  if (!Array.isArray(cards) || cards.length !== 5) {
    throw new Error(`Expected array of 5 cards, got ${cards.length}`);
  }
  for (const card of cards) {
    if (typeof card.question !== 'string' || typeof card.answer !== 'string') {
      throw new Error(`Each card must have string "question" and "answer" fields.`);
    }
  }

  return cards;
}

module.exports = { generateFlashcards };