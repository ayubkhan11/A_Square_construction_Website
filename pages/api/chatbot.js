import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const chatHistories = new Map();

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
  
  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: "Method not allowed",
      message: "Only POST requests are accepted" 
    });
  }

  try {
    // Check for API key
    if (!process.env.GROQ_API_KEY) {
      console.error('GROQ_API_KEY is not set in environment variables');
      return res.status(500).json({ 
        error: "Server configuration error",
        message: "Chat service is temporarily unavailable"
      });
    }

    // Parse request body
    let body;
    try {
      body = req.body;
      // If body is already parsed (by Next.js), use it directly
      if (typeof body === 'string') {
        body = JSON.parse(body);
      }
    } catch (parseError) {
      return res.status(400).json({ 
        error: "Invalid request format",
        message: "Please send valid JSON data" 
      });
    }

    const { message, sessionId = "default" } = body || {};

    // Validate message
    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({ 
        error: "Message required",
        message: "Please provide a message to send" 
      });
    }

    console.log(`Processing chat request - Session: ${sessionId}, Message: ${message.substring(0, 50)}...`);

    // Initialize LLM
    const llm = new ChatGroq({
      model: "llama-3.3-70b-versatile",
      temperature: 0.4,
      apiKey: process.env.GROQ_API_KEY,
      maxTokens: 500,
      timeout: 30000, // 30 second timeout
    });

    // Initialize or get chat history
    if (!chatHistories.has(sessionId)) {
      chatHistories.set(sessionId, [
        new SystemMessage(
          "You are a professional construction assistant for A Square Construction. " +
          "The company specializes in residential, commercial, industrial construction and luxury interior projects. " +
          "Be helpful, professional, and informative. Keep responses concise but thorough. " +
          "If asked about services, mention: Residential, Commercial, Industrial, and Luxury Interior Design. " +
          "If asked about contact, provide: Email: contact@asquareconstruction.com, Phone: (123) 456-7890. " +
          "If asked about projects, mention they can view portfolio on the website."
        )
      ]);
    }

    const history = chatHistories.get(sessionId);
    history.push(new HumanMessage(message));

    // Get response from LLM
    const response = await llm.invoke(history);
    history.push(response);

    // Limit history to prevent memory issues
    if (history.length > 10) {
      // Keep system message and last 4 exchanges (8 messages)
      const systemMessage = history[0];
      const recentMessages = history.slice(-8);
      history.length = 0;
      history.push(systemMessage, ...recentMessages);
    }

    console.log(`Response generated for session ${sessionId}`);

    return res.status(200).json({
      response: response.content,
      sessionId: sessionId,
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    console.error("🔥 CHATBOT ERROR:", err);
    
    // Provide user-friendly error messages
    let errorMessage = "I apologize, but I'm having trouble processing your request. ";
    
    if (err.message.includes('timeout') || err.message.includes('Timeout')) {
      errorMessage += "The request took too long to process. Please try again.";
    } else if (err.message.includes('API key') || err.message.includes('authentication')) {
      errorMessage += "There's an issue with the chat service configuration.";
    } else if (err.message.includes('network') || err.message.includes('fetch')) {
      errorMessage += "There's a network issue. Please check your connection.";
    } else {
      errorMessage += "Please try again in a few moments.";
    }

    return res.status(500).json({
      error: "Internal Server Error",
      message: errorMessage,
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}