import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

if (!process.env.GEMINI_API_KEY) {
  console.error("Missing GEMINI_API_KEY in environment");
  // Do not exit in dev—let the server start so you can still run the frontend.
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post("/api/genai", async (req, res) => {
  const { prompt } = req.body;
  if (typeof prompt !== "string" || !prompt.trim()) {
    return res.status(400).json({ error: "Missing prompt" });
  }
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return res.json({ text: response.text ?? null });
  } catch (err) {
    console.error("GenAI error:", err);
    return res.status(500).json({ error: "AI request failed" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Proxy listening on ${PORT}`));
