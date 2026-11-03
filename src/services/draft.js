import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5';

/**
 * Turn a raw customer enquiry into a professional draft reply.
 * Returns the draft text.
 */
export async function draftReply({ customerName, details }) {
  const prompt = `You are helping a small Australian trade business reply to a customer enquiry.
Write a short, friendly, professional reply that:
- thanks them for getting in touch
- shows you understood what they need
- asks for any key detail needed to give an accurate price (only if genuinely missing)
- gives a clear next step

Keep it concise and down to earth — no corporate buzzwords. Do not invent a price;
if a price is needed, say you'll confirm it once you have the details.

Customer name: ${customerName}
Their enquiry: ${details}

Write only the reply, ready to send.`;

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 400,
    messages: [{ role: 'user', content: prompt }],
  });

  // Join any text blocks in the response.
  return message.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('')
    .trim();
}
