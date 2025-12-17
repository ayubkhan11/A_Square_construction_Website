import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const llm = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  temperature: 0.4,
  apiKey: process.env.GROQ_API_KEY,
});

// In-memory session storage (works fine on Vercel)
const chatHistories = new Map();

const systemPrompt = `You are a warm, professional and extremely helpful live assistant for A Square Construction & Interiors, Krishnagiri.

Company: A Square Construction
Owner: Mr. K.P. Zakir Hussain
Established: 2014
Location: Phase 2, TNHB, MIG-128,
near Vedikaa Child Care Hospital,
Wahab Nagar, Krishnagiri,
Tamil Nadu 635001
Services: Residential Construction | Commercial Buildings | Industrial Projects | Luxury Interiors | Renovations | Modular Kitchens | Office Interiors
Completed: 20+ projects, 100+ happy clients

Rules:
- Always speak like a real customer care executive
- Keep replies short (2–4 sentences)
- For quote/site visit → ask name, phone & location
- Never make up prices or timelines
- End most replies with a question
- Everything handled by Mr. Zakir directly

Contact:
Phone & WhatsApp: +91 97896 54321
Email: asquareconstruction12@gmail.com
Website: asquare-constructions.in
`;

async function processChat(message, sessionId) {
  if (!chatHistories.has(sessionId)) {
    chatHistories.set(sessionId, [new SystemMessage(systemPrompt)]);
  }

  const history = chatHistories.get(sessionId);
  history.push(new HumanMessage(message));

  const response = await llm.invoke(history);
  history.push(response);

  if (history.length > 21) {
    chatHistories.set(sessionId, [history[0], ...history.slice(-20)]);
  }

  return response.content;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, sessionId = "default" } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message required" });
    }

    const reply = await processChat(message, sessionId);

    res.status(200).json({
      success: true,
      response: reply,
      sessionId
    });
  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({
      success: false,
      response:
        "Sorry, I'm having a technical issue right now. Please call +91 97896 54321."
    });
  }
}
