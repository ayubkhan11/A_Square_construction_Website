// server.js - FINAL CORRECTED VERSION

import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// ----- Env setup -----
dotenv.config();

// ----- __dirname replacement -----
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ----- Express app -----
const app = express();
const PORT = process.env.PORT || 3000;

// ----- Middleware -----
app.use(express.json());  // MUST come before routes!
app.use(express.static(__dirname));  // Serves files from project root

// ----- Import chatbot router from routes folder -----
let chatbotRouter;

try {
  console.log("📁 Current directory:", __dirname);
  console.log("🔍 Looking for chatbot.js in routes/ folder...");
  
  // Import from routes/chatbot.js
  const chatbotModule = await import('./routes/chatbot.js');
  chatbotRouter = chatbotModule.default;
  console.log("✅ Chatbot router loaded successfully from routes/chatbot.js");
} catch (error) {
  console.error("❌ Failed to load chatbot router:", error.message);
  console.error("💡 Check if routes/chatbot.js exists in:", __dirname);
  
  // Create a simple fallback router
  chatbotRouter = express.Router();
  
  chatbotRouter.post("/chat", (req, res) => {
    console.log("📨 Chat request (fallback):", req.body);
    
    const message = (req.body.message || '').toLowerCase();
    let response = "Welcome to A Square Construction! How can I help?";
    
    if (message.includes('hello')) response = "Hello! Welcome to A Square Construction. We specialize in construction and interiors in Krishnagiri.";
    if (message.includes('service')) response = "We offer: Residential, Commercial, Industrial construction & Luxury Interiors.";
    if (message.includes('quote')) response = "For a free quote, call +91 97896 54321. Mr. Zakir will assist you.";
    
    res.json({
      success: true,
      response: response,
      sessionId: req.body.sessionId || "fallback"
    });
  });
  
  chatbotRouter.get("/status", (req, res) => {
    res.json({ 
      status: "Chatbot (Fallback Mode)", 
      message: "routes/chatbot.js not loaded properly",
      timestamp: new Date().toISOString()
    });
  });
  
  console.log("⚠️ Using fallback chatbot (simple responses)");
}

// ----- Routes -----
// Mount at /api/chatbot to match frontend
app.use("/api/chatbot", chatbotRouter);

// Home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Test if static files are served
app.get("/test-static", (req, res) => {
  res.send(`
    <h1>Static Files Test</h1>
    <p>If you can see this, static files are working.</p>
    <p>Check these:</p>
    <ul>
      <li><a href="/js/chatbot-embed.js">/js/chatbot-embed.js</a></li>
      <li><a href="/api/chatbot/status">/api/chatbot/status</a></li>
      <li><a href="/api/test">/api/test</a></li>
    </ul>
  `);
});

// API test endpoint
app.get("/api/test", (req, res) => {
  res.json({ 
    message: "✅ Server is working!",
    timestamp: new Date().toISOString(),
    endpoints: [
      "POST /api/chatbot/chat - Send message to chatbot",
      "GET /api/chatbot/status - Check chatbot status",
      "GET / - Home page"
    ]
  });
});

// 404 Handler
app.use((req, res) => {
  console.log(`404: ${req.method} ${req.url}`);
  res.status(404).send(`
    <h1>404 - Page Not Found</h1>
    <p>Try these links:</p>
    <ul>
      <li><a href="/">Home Page</a></li>
      <li><a href="/api/chatbot/status">Chatbot Status</a></li>
      <li><a href="/api/test">API Test</a></li>
    </ul>
  `);
});

// Error Handler
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(500).json({ 
    error: "Internal server error",
    message: err.message 
  });
});

// ----- Start server -----
app.listen(PORT, () => {
  console.log(`\n🚀 Server running at http://localhost:${PORT}`);
  console.log(`📁 Project root: ${__dirname}`);
  console.log(`🤖 Chatbot API: POST http://localhost:${PORT}/api/chatbot/chat`);
  console.log(`📊 Status: GET http://localhost:${PORT}/api/chatbot/status`);
  console.log(`🧪 Test: GET http://localhost:${PORT}/api/test`);
  console.log(`🔍 Static test: GET http://localhost:${PORT}/test-static`);
  console.log(`\n💡 If chatbot doesn't work, check if routes/chatbot.js exists.`);
});