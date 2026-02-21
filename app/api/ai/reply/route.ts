import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { emailBody, senderName } = await req.json();

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const aiGeneratedReply = `Hi ${senderName || 'there'},\n\nThank you for reaching out! I have received your email and am currently reviewing the details. I will get back to you with a comprehensive update very soon.\n\nBest regards,\nYash Nirwan`;

    return NextResponse.json({ reply: aiGeneratedReply });
  } catch (error) {
    console.error("AI Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate AI reply" }, { status: 500 });
  }
}