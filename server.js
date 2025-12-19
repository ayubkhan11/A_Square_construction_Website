import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// ----- Setup -----
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ----- Middleware -----
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ----- API Routes -----
import chatbotRouter from './routes/chatbot.js';
app.use("/api/chatbot", chatbotRouter);

// ----- Page Routes -----
const pages = ['', 'about', 'contact', 'gallery', 'services'];

pages.forEach(page => {
  const route = page === '' ? '/' : `/${page}`;
  const file = page === '' ? 'index.html' : `${page}.html`;
  
  app.get(route, (req, res) => {
    res.sendFile(path.join(__dirname, "public", file));
  });
});

// ----- 404 Handler -----
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "error.html"));
});

// ----- Start Server -----
app.listen(PORT, () => {
  console.log(`🚀 Server: http://localhost:${PORT}`);
});

// Export for Vercel (optional)
export default app;