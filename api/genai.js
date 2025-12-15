import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req, res) {
  // Allow both GET (for health checks) and POST (for actual requests)
  if (req.method === 'GET') {
    return res.status(200).json({ status: 'ok' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check API key
  if (!process.env.GEMINI_API_KEY) {
    console.error('Missing GEMINI_API_KEY environment variable');
    return res.status(500).json({ error: 'Server configuration error: missing API key' });
  }

  try {
    // Handle JSON request (text prompt)
    if (req.headers['content-type']?.includes('application/json')) {
      const { prompt } = req.body;
      if (typeof prompt !== 'string' || !prompt.trim()) {
        return res.status(400).json({ error: 'Missing or invalid prompt' });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return res.status(200).json({ text: response.text ?? null });
    }

    // Handle multipart/form-data (file upload)
    if (req.headers['content-type']?.includes('multipart/form-data')) {
      // Note: In Vercel serverless functions, handling multipart is tricky.
      // We'll parse the body manually or use a library like 'busboy'.
      // For now, we'll return a helpful error if file upload is attempted.
      // If you need file support, install 'busboy' and parse multipart data.
      
      // Simplified: extract text-based prompt from multipart if available
      // (this is a basic fallback; a production solution would parse busboy)
      const prompt = req.body?.prompt || 'File uploaded (text extraction not yet implemented)';
      
      if (typeof prompt !== 'string' || !prompt.trim()) {
        return res.status(400).json({ error: 'Missing prompt or file content' });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return res.status(200).json({ text: response.text ?? null });
    }

    // Default: assume JSON body
    const { prompt } = req.body;
    if (typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'Missing or invalid prompt' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return res.status(200).json({ text: response.text ?? null });
  } catch (err) {
    console.error('GenAI API error:', err);
    return res.status(500).json({ error: 'AI request failed', details: err.message });
  }
}
