import { GoogleGenerativeAI } from "@google/generative-ai";
import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

app.use("/api/*", cors());

const apiKey = process.env.GEMINI_API_KEY as string;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 20000,
  responseMimeType: "text/plain",
};

async function runGemini(query: string) {
  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });
  const result = await chatSession.sendMessage(query);
  return result.response.text();
}

app.post("/api/gemini", async (c) => {
  const body = await c.req.json();
  const response = await runGemini(body.query);
  return c.json({
    response,
  });
});

export default {
  port: 3000,
  fetch: app.fetch,
};
