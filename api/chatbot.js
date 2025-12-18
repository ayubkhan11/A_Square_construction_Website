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

import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export const config = {
  api: {
    bodyParser: true,
  },
};

const chatHistories = new Map();

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY missing");
    }

    const body = req.body || {};
    const message = body.message;
    const sessionId = body.sessionId || "default";

    if (!message) {
      return res.status(400).json({ error: "Message required" });
    }

    const llm = new ChatGroq({
      model: "llama-3.3-70b-versatile",
      temperature: 0.4,
      apiKey: process.env.GROQ_API_KEY,
    });

    if (!chatHistories.has(sessionId)) {
      chatHistories.set(
        sessionId,
        [new SystemMessage("You are a helpful assistant.")]
      );
    }

    const history = chatHistories.get(sessionId);
    history.push(new HumanMessage(message));

    const response = await llm.invoke(history);
    history.push(response);

    return res.status(200).json({
      response: response.content,
    });
  } catch (err) {
    console.error("🔥 SERVER ERROR:", err);
    return res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
    });
  }
}
