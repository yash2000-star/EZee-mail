"use client";

import { signIn } from "next-auth/react";
import { 
  Sparkles, Search, Shield, Bot, Check, Key, 
  Settings, Mail, CheckCircle2, XCircle, ArrowRight, Clock 
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans selection:bg-blue-500/30 overflow-hidden relative">
      
      {/* Deep Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600 via-purple-600 to-transparent blur-[100px] pointer-events-none"></div>

      {/* 1. Navbar */}
      <nav className="relative z-50 max-w-7xl mx-auto px-6 py-6 flex justify-between items-center animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-2.5 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.5)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <rect width="20" height="16" x="2" y="4" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-white">Mail-Man</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-sm font-bold text-zinc-400 hover:text-white transition">How-Tos</a>
          <a href="#blog" className="text-sm font-bold text-zinc-400 hover:text-white transition">Blog</a>
          <a href="#pricing" className="text-sm font-bold text-zinc-400 hover:text-white transition">Pricing</a>
        </div>

        <button 
          onClick={() => signIn("google")} 
          className="text-sm font-bold bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-full transition backdrop-blur-md border border-white/10"
        >
          Sign In
        </button>
      </nav>

      {/* 2. Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold mb-8 animate-in fade-in zoom-in-95 duration-700 delay-150">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          <span>The AI-powered email client for Gmail</span>
        </div>

        <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-8 leading-[1.05] max-w-4xl text-balance animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          Read less. <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-white">
            Respond faster.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
          Mail-Man uses your own API key to summarize threads, extract tasks, and draft perfect replies. Zero monthly fees. Total privacy.
        </p>

        <button 
          onClick={() => signIn("google")} 
          className="group relative bg-white text-black font-extrabold py-4 px-8 rounded-full text-lg hover:scale-105 transition-all shadow-[0_0_40px_rgba(59,130,246,0.3)] flex items-center gap-2 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-700"
        >
          Connect Gmail
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </button>

      {/* Floating Teaser Card: Global Tasks & Programmable Labels */}
        <div className="mt-24 relative w-full max-w-5xl animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-1000">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-20 pointer-events-none h-full w-full"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 mx-auto px-4">
            
            {/* Left Showcase: Programmable Smart Labels (Based on Screenshot 287) */}
            <div className="bg-[#121214] border border-zinc-800 rounded-2xl p-6 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] transform hover:-translate-y-2 transition-transform duration-500">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-zinc-100 text-lg">New Smart Label</h3>
                <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Sparkles size={12}/> AI Powered
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-zinc-500 font-bold mb-1.5 block">Label Name</label>
                  <div className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-200 font-medium">
                    Urgent Invoices
                  </div>
                </div>
                
                <div>
                  <label className="text-xs text-zinc-500 font-bold mb-1.5 block">Label Prompt (AI Instructions)</label>
                  <div className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg p-3 text-sm text-zinc-400 font-medium min-h-[80px]">
                    Find any emails containing PDF receipts or requests for payment. If the due date is within 7 days, apply this label.
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <span className="text-xs text-zinc-500 font-bold">Color</span>
                  <div className="w-6 h-6 rounded-full bg-blue-500 ring-2 ring-zinc-400 ring-offset-2 ring-offset-[#121214]"></div>
                  <div className="w-6 h-6 rounded-full bg-green-500 opacity-50"></div>
                  <div className="w-6 h-6 rounded-full bg-red-500 opacity-50"></div>
                  <div className="w-6 h-6 rounded-full bg-purple-500 opacity-50"></div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <div className="w-4 h-4 rounded bg-blue-500 flex items-center justify-center"><Check size={12} className="text-white"/></div>
                  <span className="text-sm text-zinc-300 font-medium">Apply to your last 50 emails</span>
                </div>
              </div>
            </div>

            {/* Right Showcase: Master To-Do Dashboard (Based on Screenshot 286) */}
            <div className="bg-[#121214] border border-zinc-800 rounded-2xl p-6 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] transform hover:-translate-y-2 transition-transform duration-500 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-2 bg-[#0a0a0a] p-1 rounded-lg border border-zinc-800">
                  <span className="bg-zinc-800 text-white text-xs font-bold px-3 py-1.5 rounded-md">Active</span>
                  <span className="text-zinc-500 hover:text-white transition text-xs font-bold px-3 py-1.5 rounded-md">Done</span>
                </div>
                <h3 className="font-bold text-zinc-100 text-lg">Past Due</h3>
              </div>

              <div className="space-y-4 flex-1">
                {/* Task 1 */}
                <div className="border-b border-zinc-800/80 pb-4 flex items-start gap-3 group">
                  <div className="w-4 h-4 rounded border-2 border-zinc-600 mt-0.5 group-hover:border-zinc-400 transition cursor-pointer shrink-0"></div>
                  <div>
                    <p className="text-sm text-zinc-200 font-medium">Decide on BlaBlaCar ride to Delhi Cantt</p>
                    <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1 font-bold">
                      <Clock size={12} /> Feb 15, 8:00 AM
                    </p>
                  </div>
                </div>

                {/* Task 2 (Hover State) */}
                <div className="bg-zinc-900/50 -mx-3 px-3 py-3 rounded-lg border border-zinc-800 flex items-start justify-between group">
                  <div className="flex items-start gap-3">
                    <div className="w-4 h-4 rounded border-2 border-zinc-600 mt-0.5 group-hover:border-zinc-400 transition cursor-pointer shrink-0"></div>
                    <div>
                      <p className="text-sm text-zinc-200 font-medium">Prepare QR code for India AI Summit 2026</p>
                      <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1 font-bold">
                        <Clock size={12} /> Feb 19, 6:00 PM
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 text-zinc-500">
                     <Settings size={14} className="hover:text-white cursor-pointer"/>
                     <XCircle size={14} className="hover:text-red-400 cursor-pointer"/>
                  </div>
                </div>

                {/* Task 3 */}
                <div className="flex items-start gap-3 group pt-1">
                  <div className="w-4 h-4 rounded border-2 border-zinc-600 mt-0.5 group-hover:border-zinc-400 transition cursor-pointer shrink-0"></div>
                  <div>
                    <p className="text-sm text-zinc-200 font-medium">Complete Dropship store setup</p>
                    <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1 font-bold">
                      <Clock size={12} /> Feb 20, 6:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </main>

      {/* 3. Bento Box Feature Grid */}
      <section className="relative max-w-7xl mx-auto px-6 py-20 z-10">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            Everything you need. <br className="hidden md:block"/> Nothing you don't.
          </h2>
          <p className="text-zinc-400 text-lg font-medium">Powerful AI tools seamlessly integrated into your workflow.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-700">
          <div className="group relative bg-[#121214] border border-zinc-800/80 hover:border-blue-500/50 rounded-3xl p-8 overflow-hidden transition-all duration-500 shadow-lg">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors"></div>
            <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-inner"><Sparkles className="text-blue-400" size={24} /></div>
            <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Write like a pro</h3>
            <p className="text-zinc-400 font-medium leading-relaxed mb-8 text-sm">Click the Sparkles button and watch your messy thoughts instantly transform into a polished, executive-level email.</p>
            <div className="bg-[#1e1e21] border border-zinc-800 rounded-xl p-4 shadow-inner opacity-80 group-hover:opacity-100 transition-opacity">
              <div className="text-zinc-600 text-xs line-through mb-3 font-medium">yeah sure i can do that tmrw</div>
              <div className="text-blue-300 text-sm font-bold leading-snug">Absolutely, I will have the report completed for you by tomorrow morning.</div>
            </div>
          </div>
          <div className="group relative bg-[#121214] border border-zinc-800/80 hover:border-purple-500/50 rounded-3xl p-8 overflow-hidden transition-all duration-500 shadow-lg">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-purple-500/10 transition-colors"></div>
            <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-inner"><Search className="text-purple-400" size={24} /></div>
            <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Chat with your Inbox</h3>
            <p className="text-zinc-400 font-medium leading-relaxed mb-8 text-sm">Stop searching manually. Ask the Mail-Man AI assistant to find files, extract links, or summarize a 20-email thread.</p>
            <div className="bg-[#1e1e21] border border-zinc-800 rounded-xl p-4 shadow-inner opacity-80 group-hover:opacity-100 transition-opacity flex items-start gap-3">
               <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0"><Bot size={14} className="text-purple-400"/></div>
               <div className="text-purple-200 text-sm font-bold leading-snug pt-1">I found 3 emails about the Q3 budget. Would you like a summary?</div>
            </div>
          </div>
          <div className="group relative bg-[#121214] border border-zinc-800/80 hover:border-emerald-500/50 rounded-3xl p-8 overflow-hidden transition-all duration-500 shadow-lg">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors"></div>
            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-inner"><Shield className="text-emerald-400" size={24} /></div>
            <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Bring Your Own Key</h3>
            <p className="text-zinc-400 font-medium leading-relaxed mb-8 text-sm">Your data stays yours. Save your Gemini API key locally in your browser vault. Zero server storage.</p>
            <div className="bg-[#1e1e21] border border-zinc-800 rounded-xl p-4 shadow-inner opacity-80 group-hover:opacity-100 transition-opacity">
              <div className="flex justify-between items-center mb-3">
                <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Local Vault</span>
                <span className="text-emerald-400 text-xs font-bold flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded-md"><Check size={12}/> Secured</span>
              </div>
              <div className="text-zinc-600 text-sm font-mono truncate bg-black/50 p-2 rounded border border-zinc-800/50">AIzaSyB******************</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. API Guide */}
      <section id="how-it-works" className="relative max-w-7xl mx-auto px-6 py-24 z-10 border-t border-zinc-800/50 mt-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4">Set up in 60 seconds.</h2>
          <p className="text-zinc-400 text-lg font-medium max-w-2xl mx-auto">No credit cards. No subscriptions. Just grab your free Google API key and start flying through your inbox.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-zinc-700 to-transparent z-0"></div>
          <div className="relative z-10 flex flex-col items-center text-center bg-[#0a0a0a] p-6">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(59,130,246,0.2)]"><Key className="text-blue-400" size={28} /></div>
            <h3 className="text-xl font-bold text-white mb-3">1. Get your Free Key</h3>
            <p className="text-zinc-400 text-sm font-medium mb-4">Visit Google AI Studio and generate a Gemini API key. Google gives you 15 requests per minute completely free.</p>
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 text-sm font-bold flex items-center gap-1 transition">Get Key <ArrowRight size={14}/></a>
          </div>
          <div className="relative z-10 flex flex-col items-center text-center bg-[#0a0a0a] p-6">
            <div className="w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(168,85,247,0.2)]"><Settings className="text-purple-400" size={28} /></div>
            <h3 className="text-xl font-bold text-white mb-3">2. Save in your Vault</h3>
            <p className="text-zinc-400 text-sm font-medium">Paste the key into the Mail-Man Settings Gear. It saves locally in your browser. We never see it, and we never store it.</p>
          </div>
          <div className="relative z-10 flex flex-col items-center text-center bg-[#0a0a0a] p-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]"><Mail className="text-emerald-400" size={28} /></div>
            <h3 className="text-xl font-bold text-white mb-3">3. Dominate your Inbox</h3>
            <p className="text-zinc-400 text-sm font-medium">Log in securely with Gmail. Your private API key will automatically power your summaries, chats, and smart drafts.</p>
          </div>
        </div>
      </section>

      {/* 5. Pricing Section */}
      <section id="pricing" className="relative max-w-5xl mx-auto px-6 py-24 z-10 border-t border-zinc-800/50">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4">Stop paying for AI wrappers.</h2>
          <p className="text-zinc-400 text-lg font-medium">Why pay $30 a month when the AI engine is free?</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="bg-[#121214] border border-zinc-800 rounded-3xl p-8 opacity-80 scale-95">
            <h3 className="text-zinc-400 font-bold text-xl mb-2">Other AI Email Apps</h3>
            <div className="text-4xl font-extrabold text-white mb-6">$30<span className="text-lg text-zinc-500 font-medium">/mo</span></div>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-zinc-400 font-medium"><XCircle className="text-red-500 shrink-0" size={18}/> You pay for their server costs</li>
              <li className="flex items-center gap-3 text-zinc-400 font-medium"><XCircle className="text-red-500 shrink-0" size={18}/> They store your emails on their servers</li>
              <li className="flex items-center gap-3 text-zinc-400 font-medium"><XCircle className="text-red-500 shrink-0" size={18}/> Strict daily limits on AI drafts</li>
            </ul>
          </div>
          <div className="bg-gradient-to-b from-[#1a1a24] to-[#121214] border border-blue-500/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(59,130,246,0.15)] relative transform hover:-translate-y-2 transition-transform duration-500">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">The Smart Choice</div>
            <h3 className="text-blue-400 font-bold text-xl mb-2">Mail-Man (BYOK)</h3>
            <div className="text-5xl font-extrabold text-white mb-6">$0<span className="text-lg text-zinc-500 font-medium">/mo forever</span></div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-zinc-200 font-bold"><CheckCircle2 className="text-emerald-500 shrink-0" size={20}/> Leverage Google's generous Free Tier</li>
              <li className="flex items-center gap-3 text-zinc-200 font-bold"><CheckCircle2 className="text-emerald-500 shrink-0" size={20}/> 100% Private (Runs locally in your browser)</li>
              <li className="flex items-center gap-3 text-zinc-200 font-bold"><CheckCircle2 className="text-emerald-500 shrink-0" size={20}/> Unlimited AI drafts & thread summaries</li>
            </ul>
            <button onClick={() => signIn("google")} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition shadow-[0_0_20px_rgba(59,130,246,0.4)]">Start for Free</button>
          </div>
        </div>
      </section>

      {/* 6. Blog Teaser */}
      <section id="blog" className="relative max-w-7xl mx-auto px-6 py-24 z-10 border-t border-zinc-800/50">
         <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2">Latest from the Blog</h2>
            <p className="text-zinc-400 font-medium">Insights on productivity and AI privacy.</p>
          </div>
          <button className="text-blue-400 hover:text-blue-300 text-sm font-bold flex items-center gap-1 transition hidden md:flex">
              View all <ArrowRight size={14}/>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="group cursor-pointer bg-[#121214] border border-zinc-800 hover:border-zinc-600 rounded-2xl overflow-hidden transition-all">
            <div className="h-48 bg-zinc-900 border-b border-zinc-800 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 group-hover:scale-105 transition-transform duration-700"></div>
            </div>
            <div className="p-6">
              <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Engineering</p>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">Why BYOK (Bring Your Own Key) is the future of SaaS</h3>
              <p className="text-zinc-500 text-sm font-medium">Discover how local API vaults are disrupting the $30/month subscription model while protecting user data.</p>
            </div>
          </div>
          <div className="group cursor-pointer bg-[#121214] border border-zinc-800 hover:border-zinc-600 rounded-2xl overflow-hidden transition-all">
            <div className="h-48 bg-zinc-900 border-b border-zinc-800 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 group-hover:scale-105 transition-transform duration-700"></div>
            </div>
            <div className="p-6">
              <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Productivity</p>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">How to achieve Inbox Zero using RAG architecture</h3>
              <p className="text-zinc-500 text-sm font-medium">Stop reading full threads. Learn how retrieval-augmented generation scans your inbox to summarize contexts instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="relative max-w-7xl mx-auto px-6 py-12 mt-12 border-t border-zinc-800/80 z-10 flex flex-col md:flex-row items-center justify-between gap-6 animate-in fade-in duration-1000 delay-1000">
        <div className="flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity">
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-1.5 rounded-lg shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <rect width="20" height="16" x="2" y="4" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
          </div>
          <span className="text-lg font-extrabold tracking-tight text-white">Mail-Man</span>
        </div>
        <p className="text-sm text-zinc-500 font-medium text-center md:text-left">
          © {new Date().getFullYear()} Mail-Man. Built with Next.js & Google Gemini.
        </p>
        <button onClick={() => signIn("google")} className="text-sm font-bold text-zinc-400 hover:text-white transition px-4 py-2 hover:bg-zinc-800/50 rounded-lg">
          Ready to start? Sign In
        </button>
      </footer>

    </div>
  );
}