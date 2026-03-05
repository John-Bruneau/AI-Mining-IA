import { GoogleGenAI, ThinkingLevel } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getMarketAnalysis() {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Analyze the current Bitcoin market trends, mining difficulty, and profitability for a cloud mining operation. Provide a concise summary with key metrics.",
    config: {
      tools: [{ googleSearch: {} }],
    },
  });
  return response.text;
}

export async function getMiningStrategy(hashrate: number, cost: number) {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Based on a hashrate of ${hashrate} TH/s and an electricity cost of ${cost} USD/kWh, what is the optimal mining strategy? Consider pool selection, hardware maintenance, and market timing.`,
    config: {
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
    }
  });
  return response.text;
}

export async function deepOptimize(stats: any) {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Perform a deep architectural and economic optimization for a mining rig with the following real-time stats: ${JSON.stringify(stats)}. Provide a detailed, step-by-step optimization plan including hardware tweaks, network adjustments, and financial hedging strategies.`,
    config: {
      thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }
    }
  });
  return response.text;
}

export async function verifyWithMempool() {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Fetch and verify the current Bitcoin network status from mempool.space. Include current block height, median fee (sat/vB), and next difficulty adjustment estimate.",
    config: {
      tools: [{ googleSearch: {} }],
    },
  });
  return response.text;
}

export async function analyzeHardwareImage(base64Image: string, mimeType: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Image,
            mimeType: mimeType,
          },
        },
        {
          text: "Analyze this mining hardware. Identify the model if possible, assess the condition (dust, wiring, cooling), and suggest maintenance or optimization steps for better hashrate and longevity.",
        },
      ],
    },
  });
  return response.text;
}

export async function chatWithAI(message: string, context: any) {
  const chat = ai.chats.create({
    model: "gemini-3.1-pro-preview",
    config: {
      systemInstruction: "You are BitAI, an expert Bitcoin mining consultant. You help users optimize their mining rigs and understand market dynamics. Use technical but accessible language. Context: " + JSON.stringify(context),
    },
  });
  const response = await chat.sendMessage({ message });
  return response.text;
}