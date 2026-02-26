"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Sparkles, Key, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

// Cycling messages for the magic loading state
const LOADING_MESSAGES = [
    "Connecting to inbox...",
    "Reading your top emails...",
    "Generating AI summaries...",
    "Organizing your triage...",
    "Almost ready...",
];

export default function SetupPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [apiKey, setApiKey] = useState("");
    const [phase, setPhase] = useState<"input" | "loading" | "done">("input");
    const [error, setError] = useState("");
    const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
    const [progress, setProgress] = useState(0);
    const cycleRef = useRef<NodeJS.Timeout | null>(null);
    const msgIndexRef = useRef(0);

    // Redirect if already logged out
    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace("/");
        }
    }, [status, router]);

    // Redirect if user already has a key (shouldn't be on this page)
    useEffect(() => {
        if (status === "authenticated") {
            fetch("/api/user")
                .then((r) => r.json())
                .then((data) => {
                    if (data.geminiApiKey && data.geminiApiKey.trim() !== "") {
                        router.replace("/");
                    }
                })
                .catch(() => { });
        }
    }, [status, router]);

    // Cycle loading messages
    const startMessageCycle = () => {
        msgIndexRef.current = 0;
        setLoadingMessage(LOADING_MESSAGES[0]);
        cycleRef.current = setInterval(() => {
            msgIndexRef.current = (msgIndexRef.current + 1) % LOADING_MESSAGES.length;
            setLoadingMessage(LOADING_MESSAGES[msgIndexRef.current]);
        }, 2500);
    };

    // Clean up interval on unmount
    useEffect(() => {
        return () => {
            if (cycleRef.current) clearInterval(cycleRef.current);
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedKey = apiKey.trim();
        if (!trimmedKey) {
            setError("Please enter your Gemini API key.");
            return;
        }

        setError("");
        setPhase("loading");
        setProgress(10);
        startMessageCycle();

        try {
            // Step 1: Save the API key to DB
            const saveRes = await fetch("/api/user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ geminiApiKey: trimmedKey }),
            });
            if (!saveRes.ok) throw new Error("Failed to save API key.");
            setProgress(25);

            // Step 2: Fetch top 5 most recent inbox emails from Gmail
            const accessToken = (session as any)?.accessToken;
            if (!accessToken) throw new Error("No access token.");

            const gmailRes = await fetch(
                "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=5&q=in:inbox",
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            if (!gmailRes.ok) throw new Error("Failed to fetch emails.");

            const gmailData = await gmailRes.json();
            setProgress(45);

            let preloadedEmails: any[] = [];

            if (gmailData.messages && gmailData.messages.length > 0) {
                // Step 3: Fetch email details (headers + snippets)
                const detailPromises = gmailData.messages.map(async (msg: any) => {
                    try {
                        const res = await fetch(
                            `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`,
                            { headers: { Authorization: `Bearer ${accessToken}` } }
                        );
                        if (!res.ok) return null;
                        return await res.json();
                    } catch {
                        return null;
                    }
                });

                const detailedMsgs = await Promise.all(detailPromises);
                setProgress(60);

                const getHeader = (headers: any[], name: string) => {
                    const h = headers?.find((h: any) => h.name.toLowerCase() === name.toLowerCase());
                    return h ? h.value : "";
                };

                preloadedEmails = detailedMsgs
                    .filter((m: any) => m && m.payload && m.payload.headers)
                    .map((m: any) => ({
                        id: m.id,
                        snippet: m.snippet,
                        subject: getHeader(m.payload.headers, "Subject"),
                        from: getHeader(m.payload.headers, "From").split("<")[0].trim(),
                        date: getHeader(m.payload.headers, "Date"),
                        isUnread: m.labelIds?.includes("UNREAD") || false,
                        isStarred: m.labelIds?.includes("STARRED") || false,
                        to: getHeader(m.payload.headers, "To"),
                        cc: getHeader(m.payload.headers, "Cc"),
                        hasAttachment: m.payload.parts?.some(
                            (p: any) => p.filename && p.filename.length > 0
                        ) || false,
                    }));

                // Step 4: Run /api/classify on those 5 emails
                if (preloadedEmails.length > 0) {
                    const classifyPayload = preloadedEmails.map((e) => ({
                        id: e.id,
                        sender: e.from,
                        snippet: e.snippet,
                    }));

                    const classifyRes = await fetch("/api/classify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ emails: classifyPayload, apiKey: trimmedKey }),
                    });

                    setProgress(85);

                    if (classifyRes.ok) {
                        const classifyData = await classifyRes.json();
                        if (Array.isArray(classifyData)) {
                            // Merge AI summaries into emails
                            preloadedEmails = preloadedEmails.map((email) => {
                                const match = classifyData.find((r: any) => r.id === email.id);
                                return match ? { ...email, ...match } : email;
                            });
                        }
                    }
                }
            }

            // Step 5: Save pre-fetched & summarized emails to localStorage cache
            try {
                localStorage.setItem(
                    "ezee_mail_cache_Inbox",
                    JSON.stringify(preloadedEmails)
                );
            } catch {
                // localStorage might not be available in some edge cases
            }

            setProgress(100);
            setPhase("done");

            // Brief pause to show the ✓ state, then redirect
            if (cycleRef.current) clearInterval(cycleRef.current);
            setLoadingMessage("Your inbox is ready!");

            setTimeout(() => {
                router.replace("/");
            }, 1200);
        } catch (err: any) {
            console.error("Setup failed:", err);
            if (cycleRef.current) clearInterval(cycleRef.current);
            setPhase("input");
            setProgress(0);
            setError(err.message || "Something went wrong. Please try again.");
        }
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <div className="w-8 h-8 border-2 border-slate-600 border-t-violet-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden">
            {/* Ambient background glows */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Subtle grid */}
            <div
                className="absolute inset-0 opacity-[0.025] pointer-events-none"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(148,163,184,1) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,1) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                }}
            />

            {/* Main card */}
            <div className="relative z-10 w-full max-w-md mx-4">
                <div
                    className="rounded-2xl border border-slate-700/50 p-8 shadow-2xl"
                    style={{
                        background:
                            "linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.85) 100%)",
                        backdropFilter: "blur(24px)",
                        WebkitBackdropFilter: "blur(24px)",
                    }}
                >
                    {/* Logo & Header */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center mb-4 shadow-lg shadow-violet-500/25">
                            <Sparkles size={26} className="text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-50 tracking-tight">
                            Welcome to Mail-man.
                        </h1>
                        <p className="text-slate-400 text-sm mt-2 text-center leading-relaxed">
                            Enter your API key to unlock AI triage.
                        </p>
                    </div>

                    {/* Input Phase */}
                    {phase === "input" && (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="relative">
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                                    <Key size={16} />
                                </div>
                                <input
                                    type="password"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    placeholder="AIza..."
                                    autoFocus
                                    className="w-full bg-slate-800/60 border border-slate-600/50 rounded-xl pl-10 pr-4 py-3 text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                                />
                            </div>

                            {error && (
                                <p className="text-rose-400 text-xs font-medium px-1">{error}</p>
                            )}

                            <button
                                type="submit"
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-violet-900/40 hover:shadow-violet-700/40 hover:scale-[1.01] active:scale-[0.99] text-sm"
                            >
                                Unlock My Inbox
                                <ArrowRight size={16} />
                            </button>

                            <p className="text-center text-xs text-slate-500 mt-2 leading-relaxed">
                                Get a free key at{" "}
                                <a
                                    href="https://aistudio.google.com/app/apikey"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-violet-400 hover:text-violet-300 underline transition-colors"
                                >
                                    aistudio.google.com
                                </a>
                            </p>
                        </form>
                    )}

                    {/* Loading / Done Phase */}
                    {(phase === "loading" || phase === "done") && (
                        <div className="flex flex-col items-center py-6 space-y-6">
                            {/* Spinner or checkmark */}
                            <div className="relative w-16 h-16">
                                {phase === "done" ? (
                                    <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center animate-[scale-in_0.3s_ease-out]">
                                        <CheckCircle2 size={30} className="text-emerald-400" />
                                    </div>
                                ) : (
                                    <>
                                        <div className="absolute inset-0 rounded-full border-2 border-slate-700" />
                                        <div
                                            className="absolute inset-0 rounded-full border-2 border-transparent border-t-violet-500 animate-spin"
                                            style={{ animationDuration: "0.9s" }}
                                        />
                                        <div
                                            className="absolute inset-2 rounded-full border-2 border-transparent border-t-blue-400 animate-spin"
                                            style={{ animationDuration: "1.4s", animationDirection: "reverse" }}
                                        />
                                    </>
                                )}
                            </div>

                            {/* Dynamic message */}
                            <div className="text-center">
                                <p
                                    key={loadingMessage}
                                    className="text-slate-200 font-medium text-sm animate-pulse"
                                >
                                    {loadingMessage}
                                </p>
                            </div>

                            {/* Progress bar */}
                            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500 transition-all duration-700 ease-out"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>

                            {/* Step indicators */}
                            <div className="flex items-center gap-3 text-xs text-slate-500">
                                <span className={progress >= 25 ? "text-violet-400" : ""}>Save key</span>
                                <div className="w-1 h-1 rounded-full bg-slate-700" />
                                <span className={progress >= 60 ? "text-violet-400" : ""}>Fetch emails</span>
                                <div className="w-1 h-1 rounded-full bg-slate-700" />
                                <span className={progress >= 85 ? "text-violet-400" : ""}>AI triage</span>
                                <div className="w-1 h-1 rounded-full bg-slate-700" />
                                <span className={progress >= 100 ? "text-emerald-400" : ""}>Ready!</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Subtle footnote */}
                {phase === "input" && (
                    <p className="text-center text-xs text-slate-600 mt-4">
                        Your key is encrypted and stored securely in your account.
                    </p>
                )}
            </div>
        </div>
    );
}
