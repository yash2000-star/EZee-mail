import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader) return NextResponse.json({ error: "Unauthorized"}, { status: 401});

        const { id, action } = await req.json();

        let addLabelIds: string[] = [];
        let removeLabelIds: string[] = [];

       if (action === "trash") {
            addLabelIds = ["TRASH"];
            removeLabelIds = ["INBOX"];
        } else if (action === "archive") {
            removeLabelIds = ["INBOX"];
        } else if (action === "unarchive") {
            addLabelIds = ["INBOX"]; 
        } else if (action === "unread") {
            addLabelIds = ["UNREAD"];
          } else if (action === "read") {
            removeLabelIds = ["UNREAD"];
        } else if (action === "star") {
            addLabelIds = ["STARRED"];
        } else if (action === "unstar") {
            removeLabelIds = ["STARRED"];
        }

        const response = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}/modify`, {
            method: "POST",
            headers: {
                "Authorization": authHeader,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ addLabelIds, removeLabelIds }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("GOOGLE API EXACT ERROR:", errorData); 
            throw new Error(`Google rejected the action: ${errorData.error?.message || "Unknown error"}`);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Action Error", error);
        return NextResponse.json({ error: "Action failed "}, {status: 500});
    }
}