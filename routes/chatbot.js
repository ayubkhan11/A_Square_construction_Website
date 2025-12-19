import express from "express";
import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import dotenv from "dotenv";

const router = express.Router();

// Load environment variables
dotenv.config();

// Initialize Groq AI
const llm = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  temperature: 0.4,
  apiKey: process.env.GROQ_API_KEY,
});

// In-memory chat history
const chatHistories = new Map();

// Super professional system prompt for A Square Construction
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
- No hr or marketing team. Everthing is handled by Mr. Zakir directly.
- if ask for meeting or schedule a meeting then share zakir's contact details and office address"

Contact Details (use exactly):
Phone & WhatsApp: +91 9940792792
Email: asquareconstruction12@gmail.com
Website: https://asquare-constructions.in/

Reply in a natural, South Indian professional tone.`;

const processChat = async (message, sessionId = "default") => {
  try {
    // Create new session with system prompt if doesn't exist
    if (!chatHistories.has(sessionId)) {
      chatHistories.set(sessionId, [new SystemMessage(systemPrompt)]);
    }

    const history = chatHistories.get(sessionId);
    history.push(new HumanMessage(message));

    const response = await llm.invoke(history);
    const aiReply = response.content;

    history.push(response);

    // Keep only last 20 messages + system prompt
    if (history.length > 21) {
      chatHistories.set(sessionId, [history[0], ...history.slice(-20)]);
    }

    return aiReply;
  } catch (error) {
    console.error("AI Error:", error.message);
    return "Sorry, I'm having a technical issue right now. Please call us directly at +91 9940792792 – we'll be happy to help!";
  }
};

// Main chat endpoint
router.post("/chat", async (req, res) => {
  try {
    console.log("📨 Received chat request:", req.body);
    
    const { message, sessionId } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ 
        success: false, 
        error: "Message required" 
      });
    }

    console.log("🔍 Processing message:", message.trim());
    
    const reply = await processChat(message.trim(), sessionId || "default");
    
    console.log("✅ Response generated:", reply.substring(0, 50) + "...");

    res.json({
      success: true,
      response: reply,
      sessionId: sessionId || "default"
    });
    
  } catch (error) {
    console.error("❌ Error in /chat endpoint:", error);
    console.error("Stack trace:", error.stack);
    
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: error.message,
      suggestion: "Please call +91 9940792792 for immediate assistance"
    });
  }
});

// Optional: health check
router.get("/status", (req, res) => {
  res.json({ 
    status: "A Square Construction Chatbot → Online", 
    sessions: chatHistories.size,
    phone: "+91 9940792792",
    company: "A Square Construction"
  });
});

export default router;