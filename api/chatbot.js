import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import dotenv from "dotenv";

dotenv.config();

// Initialize Groq
const llm = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  temperature: 0.4,
  apiKey: process.env.GROQ_API_KEY,
});

// In-memory session storage (works per serverless instance)
const chatHistories = new Map();

// System Prompt
const systemPrompt = `You are a warm, professional and extremely helpful live assistant for A Square Construction & Interiors, Krishnagiri.

Company: A Square Construction
Owner: Mr. K.P. Zakir Hussain
Established: 2014
Location: Phase 2, TNHB, MIG-128, near Vedikaa Child Care Hospital, Wahab Nagar, Krishnagiri, Tamil Nadu 635001
Services: Residential Construction | Commercial Buildings | Industrial Projects | Luxury Interiors | Renovations | Modular Kitchens | Office Interiors
Completed: 20+ projects, 100+ happy clients

Rules:
- Always speak like a real customer care executive (friendly & confident)
- Keep replies short and natural (2–4 sentences max)
- For any quote/site visit request → say:
  "Wonderful! Please share your name, phone number and project location — Mr. Zakir will personally call you within 1 hour for a free consultation & estimate."
- Never make up prices or timelines
- End most replies with a question
- Everything is handled directly by Mr. Zakir
- If user asks for meeting → share contact details and office address

Contact Details (use exactly):
Phone & WhatsApp: +91 97896 54321
Email: asquareconstruction12@gmail.com
Website: asquare-constructions.in

Reply in a natural South Indian professional tone.`;

// Vercel Serverless Handler
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, sessionId = "default" } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message required" });
    }

    // Initialize session
    if (!chatHistories.has(sessionId)) {
      chatHistories.set(sessionId, [new SystemMessage(systemPrompt)]);
    }

    const history = chatHistories.get(sessionId);
    history.push(new HumanMessage(message.trim()));

    const response = await llm.invoke(history);
    history.push(response);

    // Keep memory short
    if (history.length > 21) {
      chatHistories.set(sessionId, [history[0], ...history.slice(-20)]);
    }

    return res.status(200).json({
      response: response.content,
      sessionId,
    });

  } catch (error) {
    console.error("Chatbot error:", error);
    return res.status(500).json({
      response:
        "Sorry, I'm facing a technical issue right now. Please call us directly at +91 97896 54321 — we’ll be happy to help!",
    });
  }
}
