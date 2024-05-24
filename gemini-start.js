import dotenv from "dotenv"
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

console.log(genAI.apiKey);

async function run(prompt) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro"});

  const response = (await model.generateContent(prompt)).response;
  const text = response.text();
  return text;
}

export default run;