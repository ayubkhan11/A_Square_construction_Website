export const config = {
  runtime: "nodejs",
};

import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import dotenv from "dotenv";

dotenv.config();

const llm = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  temperature: 0.4,
  apiKey: process.env.GROQ_API_KEY,
});

const chatHistories = new Map();

const systemPrompt = `You are a warm, professional and extremely helpful live assistant for A Square Construction & Interiors, Krishnagiri.

Company: A Square Construction
Owner: Mr. K.P. Zakir Hussain
Established: 2014
Location: Phase 2, TNHB, MIG-128, near Vedikaa Child Care Hospital, Wahab Nagar, Krishnagiri, Tamil Nadu 635001
Services: Residential Construction | Commercial Buildings | Industrial Projects | Luxury Interiors | Renovations | Modular Kitchens | Office Interiors
Completed: 20+ projects, 100+ happy clients

Rules:
- Always speak like a real customer care executive
- Keep replies 2–4 sentences
- For site visit/quote → ask name, phone & location
- Never invent prices or timelines
- End replies with a question
- Everything handled directly by Mr. Zakir

Contact:
Phone & WhatsApp: +91 97896 54321
Email: asquareconstruction12@gmail.com
Website: asquare-constructions.in

Reply in a natural South Indian professional tone.`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("GROQ KEY EXISTS:", !!process.env.GROQ_API_KEY);

    const { message, sessionId = "default" } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ error: "Message required" });
    }

    if (!chatHistories.has(sessionId)) {
      chatHistories.set(sessionId, [new SystemMessage(systemPrompt)]);
    }

    const history = chatHistories.get(sessionId);
    history.push(new HumanMessage(message.trim()));

    const response = await llm.invoke(history);
    history.push(response);

    if (history.length > 21) {
      chatHistories.set(sessionId, [history[0], ...history.slice(-20)]);
    }

    return res.json({
      response: response.content,
      sessionId,
    });

  } catch (err) {
    console.error("CHATBOT ERROR:", err);
    return res.status(500).json({
      response:
        "Sorry, we are facing a technical issue right now. Please call +91 97896 54321 for immediate assistance.",
    });
  }
}
