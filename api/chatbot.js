import dotenv from "dotenv";
dotenv.config();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, sessionId } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message required" });
  }

  // 🔹 Simple test response
  return res.status(200).json({
    response: `Thanks for contacting A Square Construction. You said: "${message}"`
  });
}
