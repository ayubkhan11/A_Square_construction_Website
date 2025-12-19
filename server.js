// server.js - USING EXTERNAL CHATBOT.JS
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
app.use(express.json());

// ✅ Serve static files from PUBLIC folder
app.use(express.static(path.join(__dirname, "public")));

// ============================================
// ✅ IMPORT CHATBOT FROM EXTERNAL FILE
// ============================================
import chatbotRouter from './routes/chatbot.js';
app.use("/api/chatbot", chatbotRouter);

// ============================================
// OTHER ROUTES
// ============================================

// Home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Test endpoint
app.get("/api/test", (req, res) => {
  res.json({ 
    message: "✅ Server is working!",
    timestamp: new Date().toISOString(),
    chatbot: {
      chat: "POST /api/chatbot/chat",
      status: "GET /api/chatbot/status"
    }
  });
});

// 404 Handler - MUST BE LAST
app.use((req, res) => {
  console.log("404 for:", req.method, req.url);
  res.status(404).json({ 
    error: "Not Found",
    path: req.url,
    method: req.method,
    available: [
      "GET /",
      "POST /api/chatbot/chat",
      "GET /api/chatbot/status",
      "GET /api/test",
      "GET /about.html",
      "GET /contact.html",
      "GET /gallery.html",
      "GET /services.html"
    ]
  });
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
  console.log(`📁 Serving from: ${path.join(__dirname, "public")}`);
  console.log(`🤖 Chatbot: Imported from routes/chatbot.js`);
  console.log(`\n📊 TEST ENDPOINTS:`);
  console.log(`   • GET  http://localhost:${PORT}/api/chatbot/status`);
  console.log(`   • POST http://localhost:${PORT}/api/chatbot/chat`);
  console.log(`   • GET  http://localhost:${PORT}/api/test`);
  console.log(`\n📂 PAGES:`);
  console.log(`   • http://localhost:${PORT}/`);
  console.log(`   • http://localhost:${PORT}/about.html`);
  console.log(`   • http://localhost:${PORT}/contact.html`);
  console.log(`   • http://localhost:${PORT}/gallery.html`);
  console.log(`   • http://localhost:${PORT}/services.html`);
});