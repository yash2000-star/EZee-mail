import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Setup
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(request: Request) {
    const data = await request.json();
    const { snippet } = data;

    try {
        // Model
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite-001" });

        // Prompt 
       const prompt = `
        Act as an email assistant. Read this email snippet: "${snippet}"
        
        Provide exactly 4 things in strictly valid JSON format:
        1. "category": Classify it as "Important", "Social", "Promotions", or "Spam".
        2. "summary": A very short, 1-sentence summary of what the email is about.
        3. "requires_reply": true or false. (Does this email look like it needs a response?)
        4. "draft_reply": If requires_reply is true, write a short, professional draft response. If false, make it an empty string "".
        
        DO NOT include markdown formatting like \`\`\`json. Just output the raw JSON object.
        `;

        // Ask Ai
        const result = await model.generateContent(prompt);
        const rawText = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();

        console.log("AI RAW OUTPUT:", rawText);

        const aiData = JSON.parse(rawText)

        // answer back to Frontend 
        return NextResponse.json( aiData );

    } catch (error) {
        console.error("AI Error:", error);
      return NextResponse.json({ 
            category: "Error", 
            summary: "Failed to read email." 
        }, { status: 500});
    }
}