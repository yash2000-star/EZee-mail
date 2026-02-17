import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Setup
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(request: Request) {
    const data = await request.json();
    const { snippet } = data;

    try {
        // Model
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        // Prompt 
        const prompt = `
        Act as an email assistant. 
      Classify this email snippet into one of these categories: "Important", "Social", "Promotions", "Spam".
      
      Snippet: "${snippet}"
      
      Reply ONLY with the category name. No explanations.
        `;

        // Ask Ai
        const result = await model.generateContent(prompt);
        const category = result.response.text().trim();

        console.log("AI DECIDED:", category);

        // answer back to Frontend 
        return NextResponse.json({ category });

    } catch (error) {
        console.error("AI Error:", error);
        return NextResponse.json({ category: "Error" }, { status: 500})
    }
}