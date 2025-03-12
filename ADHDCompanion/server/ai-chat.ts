import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const systemPrompt = `You are an ADHD coach and mental health assistant. Your role is to:
1. Provide practical advice for managing ADHD symptoms
2. Suggest coping strategies and organizational techniques
3. Offer emotional support and encouragement
4. Help break down tasks into manageable steps
5. Share evidence-based ADHD management strategies

Keep responses concise, clear, and easy to follow. Use bullet points and short paragraphs.
Always maintain a supportive and understanding tone.`;

export async function getAIResponse(message: string): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    return "I'm currently unable to respond as the AI service is not configured. Please try again later.";
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return response.choices[0].message.content || "I'm having trouble understanding. Could you rephrase that?";
  } catch (error) {
    console.error('OpenAI API Error:', error);
    if (error.status === 429) {
      return "I'm currently experiencing high demand. Please try again in a few moments.";
    }
    return "I'm having technical difficulties right now. Please try again later.";
  }
}