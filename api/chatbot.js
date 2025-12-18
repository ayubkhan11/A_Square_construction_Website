// import dotenv from "dotenv";
// dotenv.config();

// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ error: "Method not allowed" });
//   }

//   const { message, sessionId } = req.body;

//   if (!message) {
//     return res.status(400).json({ error: "Message required" });
//   }

//   // 🔹 Simple test response
//   return res.status(200).json({
//     response: `Thanks for contacting A Square Construction. You said: "${message}"`
//   });
// }

import dotenv from "dotenv";
import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

dotenv.config();

// Initialize Groq AI
const llm = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  temperature: 0.4,
  apiKey: process.env.GROQ_API_KEY,
});

// In-memory chat history (serverless-safe but resets on cold start)
const chatHistories = new Map();

// System prompt
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
- Always speak like a real customer care executive (friendly & confident)
- Keep replies short and natural (2–4 sentences max)
- For any quote/site visit request → reply: "Wonderful! Please share your name, phone number and project location — Mr. Zakir will personally call you within 1 hour for a free consultation & estimate."
- Never make up prices or timelines
- End most replies with a question to continue the chat
- No hr or marketing team. Everything is handled by Mr. Zakir directly
- If asked for a meeting → share Zakir’s contact details and office address

Contact Details (use exactly):
Phone & WhatsApp: +91 97896 54321
Email: asquareconstruction12@gmail.com
Website: asquare-constructions.in

Reply in a natural, South Indian professional tone.`;

async function processChat(message, sessionId = "default") {
  try {
    if (!chatHistories.has(sessionId)) {
      chatHistories.set(sessionId, [new SystemMessage(systemPrompt)]);
    }

    const history = chatHistories.get(sessionId);
    history.push(new HumanMessage(message));

    const response = await llm.invoke(history);
    history.push(response);

    // Keep system prompt + last 20 messages
    if (history.length > 21) {
      chatHistories.set(sessionId, [history[0], ...history.slice(-20)]);
    }

    return response.content;
  } catch (err) {
    console.error("AI Error:", err);
    return "Sorry, I'm facing a technical issue right now. Please call us directly at +91 97896 54321 – we’ll be happy to help!";
  }
}

// ✅ Serverless API handler
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, sessionId } = req.body || {};

  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "Message required" });
  }

  const reply = await processChat(message.trim(), sessionId || "default");

  return res.status(200).json({
    success: true,
    response: reply,
    sessionId: sessionId || "default",
  });
}
  