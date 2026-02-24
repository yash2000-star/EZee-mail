import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { draft, apiKey, language = "English", style = "Default", command = "" } = await req.json();

    if (!apiKey) {
      return NextResponse.json({ error: "No API key provided." }, { status: 401 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    // Define tone rules dynamically based on selected style
    let styleInstruction = "Make the tone more professional, clear, and polite.";
    if (style === "Concise") {
      styleInstruction = "Make the tone extremely concise and brief. Get straight to the point in as few words as possible.";
    } else if (style === "Friendly") {
      styleInstruction = "Make the tone exceptionally friendly, warm, and approachable. Express enthusiasm.";
    } else if (style === "Professional") {
      styleInstruction = "Make the tone highly formal, business-appropriate, and strictly professional.";
    }

    const hasMeaningfulDraft = draft && draft.trim() !== "" && draft !== "<p><br></p>";

    // The Prompt: We explicitly tell it to preserve HTML tags
    const prompt = `
      You are an elite executive copywriter. 
      
      ${hasMeaningfulDraft
        ? "The user has written a draft email. Your job is to improve it."
        : "The user needs you to write a completely new email from scratch based on their instructions."}
      
      CRITICAL INSTRUCTIONS:
      1. ${styleInstruction}
      2. Translate and write the final email entirely in ${language}. Ensure it sounds native in ${language}.
      ${command ? `3. The user has provided a SPECIFIC CUSTOM COMMAND: "${command}". YOU MUST FOLLOW THIS COMMAND OVER EVERYTHING ELSE.` : "3. Fix any spelling or grammar mistakes if editing a draft."}
      4. Format the output entirely in HTML. Use <p>, <b>, <i>, <br> where appropriate to make it readable. Do not strip formatting.
      5. DO NOT wrap your response in markdown blocks like \`\`\`html. Just return the raw HTML string.
      
      ${hasMeaningfulDraft ? `Here is the user's draft to work with:\n${draft}` : ""}
      
      Return ONLY the final HTML string.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let enhancedText = response.text().trim();

    // Safety check: Sometimes Gemini stubbornly adds markdown wrappers anyway. Let's strip them if they exist.
    if (enhancedText.startsWith("```html")) {
      enhancedText = enhancedText.replace(/^```html\n?/, "").replace(/\n?```$/, "");
    } else if (enhancedText.startsWith("```")) {
      enhancedText = enhancedText.replace(/^```\n?/, "").replace(/\n?```$/, "");
    }

    return NextResponse.json({ enhancedText });

  } catch (error: any) {
    console.error("AI Enhance Server Error:", error);
    return NextResponse.json({ error: "Failed to enhance draft" }, { status: 500 });
  }
}