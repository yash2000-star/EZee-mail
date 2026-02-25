"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionTemplate, useMotionValue } from "framer-motion";
import {
  ArrowRight, Check, Bot, Shield, Sparkles,
  Mail, Plus, Search, Tag, BarChart3, Clock,
  ChevronRight, Star, Menu, X
} from "lucide-react";
import { TextGenerateEffect } from "./ui/text-generate-effect";
import { ContainerScroll } from "./ui/container-scroll-animation";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";
import { HoverEffect } from "./ui/card-hover-effect";
import { MovingBorder } from "./ui/moving-border";
import { FlipWords } from "./ui/flip-words";
import { TrainYourAIAnimation, MultiModelHubAnimation, TaskExtractionAnimation, AddYourBrandAnimation } from "./ui/bento-animations";
import { StickyScrollUseCases } from "./ui/sticky-scroll-use-cases";
import { Geist } from "next/font/google";

const geist = Geist({ subsets: ["latin"] });

// ===== ANIMATION HELPERS =====
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true, margin: "-80px" },
};

const cardFade = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

// ===== LOGO CAROUSEL DATA =====
const LOGOS = [
  "Google", "Stripe", "Notion", "Linear", "Vercel", "Figma", "Slack", "Intercom"
];

// ===== DYNAMIC USE CASES =====
const USE_CASES = ["Agency", "Freelancer", "Startup", "Enterprise", "E-commerce"];

// ===== FAQ DATA =====
const FAQS = [
  {
    q: "How does Mail-man use my data?",
    a: "We never store your emails. All email content is processed in-memory via your own API key and never persisted on our servers. Your privacy is absolute."
  },
  {
    q: "Can I use my own AI keys?",
    a: "Yes! Mail-man supports Bring Your Own Key (BYOK) for Gemini, OpenAI, and Anthropic. Just paste your key in settings and you're ready."
  },
  {
    q: "Is there a free plan?",
    a: "Absolutely. The free plan includes full Gmail access, up to 30 emails and Smart Labels. The Pro plan unlocks unlimited AI processing and priority support."
  },
  {
    q: "How fast is email classification?",
    a: "Classification happens in seconds per email using your connected AI model. Batch processing of 30 emails typically completes in under 2 minutes."
  },
];

function SpotlightCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      variants={cardFade}
      className={`group relative ${className}`}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100 dark:group-hover:opacity-100 z-10"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(59, 130, 246, 0.12),
              transparent 80%
            )
          `,
        }}
      />
      {children}
    </motion.div>
  );
}

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [useCaseIdx, setUseCaseIdx] = useState(0);
  const [inputVal, setInputVal] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);

  const footerRef = useRef<HTMLElement>(null);
  const [footerHeight, setFooterHeight] = useState(0);

  useEffect(() => {
    if (!footerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setFooterHeight((entry.target as HTMLElement).offsetHeight);
      }
    });
    resizeObserver.observe(footerRef.current);
    setFooterHeight(footerRef.current.offsetHeight);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cycle through use cases
  useEffect(() => {
    const interval = setInterval(() => {
      setUseCaseIdx(i => (i + 1) % USE_CASES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 ${geist.className} overflow-x-clip selection:bg-blue-100`}>

      <main
        className="relative z-10 bg-white rounded-b-[2.5rem] md:rounded-b-[4rem] shadow-[0_20px_80px_rgba(0,0,0,0.08)]"
        style={{ marginBottom: footerHeight }}
      >

        {/* Background glow removed for Lamp Effect */}

        {/* ─── 1. NAVBAR (Dynamic Scroll Style) ─── */}
        <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 pointer-events-none px-6 py-4`}>
          <div className={`pointer-events-auto max-w-6xl mx-auto flex items-center justify-between transition-all duration-300 ${isScrolled
            ? "bg-white/70 backdrop-blur-xl border border-gray-200/50 shadow-lg shadow-black/[0.03] rounded-2xl px-6 py-3"
            : "px-2 py-2"
            }`}>
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className={`transition-colors duration-300 flex items-center justify-center rounded-xl w-8 h-8 ${isScrolled ? "bg-blue-600 shadow-md shadow-blue-500/20" : ""}`}>
                <Mail size={18} strokeWidth={isScrolled ? 3 : 2.5} className={isScrolled ? "text-white" : "text-white"} />
              </div>
              <span className={`font-bold transition-colors duration-300 ${isScrolled ? "text-xl text-slate-900 tracking-tight" : "text-lg text-white tracking-tight"}`}>Mail-man</span>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8">
              {["Products", "Pricing", "Blog", "Resources"].map(link => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className={`text-sm font-semibold transition duration-300 ${isScrolled ? "text-slate-500 hover:text-slate-900" : "text-slate-300 hover:text-white"
                    }`}
                >
                  {link}
                </a>
              ))}
            </div>

            {/* CTA + Hamburger */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => signIn("google")}
                className={`text-sm font-bold py-2.5 px-5 rounded-xl transition-all duration-300 flex items-center gap-2 ${isScrolled
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20"
                  : "bg-white/10 hover:bg-white/20 border border-white/5 text-slate-200 backdrop-blur-md"
                  }`}
              >
                Sign up {isScrolled && <ArrowRight size={14} strokeWidth={3} className="inline ml-1" />}
              </button>
              {/* Mobile hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`md:hidden p-2 transition duration-300 ${isScrolled ? "text-slate-600 hover:text-slate-900" : "text-slate-400 hover:text-white"
                  }`}
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 mx-auto max-w-6xl bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl px-6 py-4 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
              {["Products", "Pricing", "Blog", "Resources"].map(link => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-semibold text-slate-300 hover:text-white transition py-1"
                >
                  {link}
                </a>
              ))}
            </div>
          )}
        </nav>

        {/* ─── 2. HERO SECTION WITH BLUE GLOW & DASHBOARD SCROLL ─── */}
        <section className="relative z-10 bg-slate-950 w-full overflow-hidden flex flex-col items-center min-h-[100vh]">

          {/* Subtle Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

          {/* Massive Blue Diffuse Glow */}
          <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-radial from-blue-600/40 via-blue-600/10 to-transparent rounded-full blur-[100px] pointer-events-none"></div>

          <div className="pt-24 md:pt-32 relative z-20 w-full flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="flex flex-col items-center justify-center text-center mt-8 w-full px-4"
            >
              {/* Headline */}
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-sans tracking-tight leading-[1.15] mb-8 text-slate-300 max-w-4xl font-light">
                <TextGenerateEffect
                  words="AI Powered Email, Built to Save You Time"
                  className="text-white font-medium"
                  duration={0.3}
                />
              </h1>

              {/* Animated Aceternity Input Large Panel */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.8, ease: "easeOut" }}
                className="relative w-full max-w-2xl mx-auto mb-20"
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[150%] bg-blue-600/50 rounded-[4rem] blur-[60px] pointer-events-none -z-10"></div>

                <div className="relative bg-white/10 backdrop-blur-2xl border border-white/30 rounded-[2rem] p-3 shadow-[0_20px_60px_rgba(0,0,0,0.1),0_0_40px_rgba(255,255,255,0.05),inset_0_1px_1px_rgba(255,255,255,0.3)] h-20 flex items-center">

                  {/* Left side mock buttons to match reference image exactly */}
                  <div className="hidden sm:flex items-center gap-2 absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                    <div className="w-8 h-8 rounded-full bg-white/40 border border-white/20 flex items-center justify-center text-slate-600 shadow-sm backdrop-blur-md">
                      <Plus size={14} strokeWidth={2.5} />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/40 border border-white/20 flex items-center justify-center text-slate-600 shadow-sm backdrop-blur-md">
                      <div className="w-2.5 h-3.5 border-2 border-current rounded-full" />
                    </div>
                  </div>

                  <PlaceholdersAndVanishInput
                    placeholders={[
                      "Summarize my inbox...",
                      "Find the email from my boss...",
                      "Create a task from the recent invoice...",
                      "Reply to The Hindu...",
                    ]}
                    onChange={(e) => setInputVal(e.target.value)}
                    onSubmit={(e) => signIn("google")}
                  />
                </div>
              </motion.div>

              {/* ─── LOGO CAROUSEL (Moved Below Search Bar) 
            <div className="w-full border-t border-b border-white/5 py-10 bg-transparent overflow-hidden relative mt-4">
              <p className="text-center text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Trusted by teams at</p>
              <div className="flex items-center gap-28 animate-marquee whitespace-nowrap opacity-60">
                {[...LOGOS, ...LOGOS, ...LOGOS].map((logo, i) => (
                  <span key={i} className="text-xl font-bold text-slate-400 shrink-0">
                    {logo}
                  </span>
                ))}
              </div>
            </div> ─── */}

            </motion.div>
          </div>

          {/* The Dashboard Scroll (Wow Factor) */}
          <div className="w-full -mt-[5rem] sm:-mt-[10rem] md:-mt-[15rem] mb-20 relative z-20">
            <ContainerScroll
              titleComponent={
                <div className="flex flex-col items-center mb-10 text-white">
                  {/* Optional additional title, omitted for cleaner look */}
                </div>
              }
            >
              {/* Mock Dashboard inside the ContainerScroll */}
              <div className="w-full h-full bg-white rounded-2xl flex border border-gray-200 overflow-hidden text-slate-900 pointer-events-none select-none">
                {/* Sidebar */}
                <div className="hidden sm:flex w-56 bg-slate-50 border-r border-gray-200 p-4 flex-col gap-2">
                  <div className="flex items-center gap-2 mb-6 ml-1 mt-2">
                    <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Mail size={14} className="text-white" strokeWidth={2.5} />
                    </div>
                    <span className="font-extrabold text-lg tracking-tight">Mail-man</span>
                  </div>
                  <div className="h-9 bg-blue-100/50 rounded-lg text-blue-700 font-bold px-3 flex items-center gap-2 text-sm"><Mail size={16} strokeWidth={2.5} /> Inbox</div>
                  <div className="h-9 rounded-lg text-slate-600 font-semibold px-3 flex items-center gap-2 text-sm"><Star size={16} strokeWidth={2} /> Starred</div>
                  <div className="h-9 rounded-lg text-slate-600 font-semibold px-3 flex items-center gap-2 text-sm"><Check size={16} strokeWidth={2} /> To-do</div>

                  <div className="mt-8 text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-3 mb-1">Smart Labels</div>
                  <div className="h-8 rounded-lg text-slate-600 font-semibold px-3 flex items-center gap-2 text-xs"><div className="w-2 h-2 rounded-full bg-purple-500"></div> Finance</div>
                  <div className="h-8 rounded-lg text-slate-600 font-semibold px-3 flex items-center gap-2 text-xs"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Investors</div>
                </div>
                {/* Feed */}
                <div className="flex-1 flex flex-col bg-white">
                  <div className="h-16 border-b border-gray-100 flex items-center px-6 justify-between">
                    <h2 className="text-xl font-bold font-sans tracking-tight">Inbox</h2>
                    <div className="bg-slate-100 px-3 py-1.5 rounded-lg flex items-center gap-2 text-slate-500 text-sm font-semibold">
                      <Search size={14} /> Search emails...
                    </div>
                  </div>
                  <div className="p-4 flex flex-col gap-3 h-full overflow-hidden">
                    {[
                      { from: "Alex (Stripe)", subject: "Payment received: $499", tag: "Finance", color: "bg-purple-50 border border-purple-100 text-purple-600", snippet: "Your recent invoice #INV-2049 has been successfully paid by the client..." },
                      { from: "Sarah (Investor)", subject: "Following up on Q3 deck", tag: "Investors", color: "bg-emerald-50 border border-emerald-100 text-emerald-600", snippet: "Hi team, loved the traction you showed in the Q3 deck. Can we schedule a quick call..." },
                      { from: "Figma Team", subject: "New comments on Design file", tag: "Work", color: "bg-blue-50 border border-blue-100 text-blue-600", snippet: "Jane added 3 new comments to 'Landing Page V2'. Review them now..." },
                    ].map((item, i) => (
                      <div key={i} className="p-4 border border-gray-100 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] bg-white flex flex-col gap-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-[15px]">{item.from}</span>
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${item.color}`}>{item.tag}</span>
                        </div>
                        <span className="text-sm font-bold text-slate-800">{item.subject}</span>
                        <span className="text-xs font-medium text-slate-500 truncate">{item.snippet}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* AI Pane */}
                <div className="hidden lg:flex w-[22rem] border-l border-gray-200 bg-slate-50/50 p-5 flex-col">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/20"><Bot size={16} strokeWidth={2.5} /></div>
                    <span className="font-bold text-slate-800">Mail-man AI</span>
                  </div>

                  <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 p-5 mt-4 flex flex-col gap-4">
                    <div className="flex items-start gap-3">
                      <Sparkles size={16} className="text-blue-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-slate-800 mb-1">Thread Insight</p>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">Sarah is interested in the Q3 deck and wants to schedule a call next week. You need to reply to her by Friday.</p>
                      </div>
                    </div>
                    <div className="h-px bg-gray-100 w-full my-1"></div>
                    <div>
                      <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Suggested Action</p>
                      <div className="bg-blue-50 text-blue-600 text-xs font-bold py-2 rounded-lg text-center cursor-pointer border border-blue-100 hover:bg-blue-100 transition">Draft Reply to Sarah</div>
                    </div>
                  </div>
                </div>
              </div>
            </ContainerScroll>
          </div>
        </section>


        {/* ─── 4. BENTO FEATURES GRID ─── */}
        <section id="features" className="relative z-10 max-w-6xl mx-auto px-6 py-28">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-950 mb-4">
              Every tool you need.<br />Nothing you don't.
            </h2>
            <p className="text-slate-500 font-medium text-lg">Intelligent email management, powered by the AI model of your choice.</p>
          </motion.div>

          <HoverEffect
            items={[
              {
                className: "md:col-span-8",
                children: (
                  <div className="flex flex-col h-full gap-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                        <Sparkles className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-slate-900">
                          Train Your AI
                        </h3>
                        <p className="text-sm text-slate-500 font-medium">
                          Create smart labels with natural language instructions
                        </p>
                      </div>
                    </div>
                    <TrainYourAIAnimation />
                  </div>
                ),
              },
              {
                className: "md:col-span-4",
                children: (
                  <div className="flex flex-col h-full">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mb-6">
                      <Tag className="text-emerald-600" size={20} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-3">
                      Add Your Brand
                    </h3>
                    <p className="text-slate-500 font-medium text-sm leading-relaxed flex-1">
                      Custom labels with colors, smart AI instructions, and retroactive email tagging across your last 50 messages.
                    </p>
                    <AddYourBrandAnimation />
                  </div>
                ),
              },
              {
                className: "md:col-span-5 !p-0 !bg-blue-600 rounded-[3rem]",
                children: (
                  <div className="relative overflow-hidden h-full rounded-3xl group">
                    <MovingBorder duration={3000} rx="30%" ry="30%">
                      <div className="h-20 w-20 opacity-[0.8] bg-[radial-gradient(circle_at_center,theme(colors.white)_0,transparent_100%)] blur-md animate-spin pointer-events-none" />
                    </MovingBorder>

                    <div className="absolute inset-[2px] bg-blue-600 rounded-[calc(1.5rem-2px)] p-8 flex flex-col z-20">
                      <div className="relative z-10 flex-1">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center mb-6">
                          <Bot size={20} className="text-white" />
                        </div>
                        <h3 className="text-2xl font-black mb-3 text-white">Chat with Inbox</h3>
                        <p className="text-blue-100 font-medium text-sm leading-relaxed">
                          Ask plain-English questions about your email threads. "What did Sarah say about the proposal?"
                        </p>
                      </div>
                      {/* Mock chat bubble loop */}
                      <div className="relative mt-8 h-20 w-full pointer-events-none overflow-hidden">
                        <motion.div
                          initial={{ y: 80, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{
                            duration: 0.5,
                            delay: 0.5,
                            repeat: Infinity,
                            repeatType: "loop",
                            repeatDelay: 4.5, // 5s total loop
                          }}
                          className="absolute top-0 right-0 left-4 bg-white/10 backdrop-blur rounded-2xl rounded-tr-sm p-3 text-sm text-white/90 font-medium border border-white/10"
                        >
                          "What did Sarah say about the proposal?"
                        </motion.div>

                        <motion.div
                          initial={{ y: 80, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{
                            duration: 0.5,
                            delay: 2.0, // Appears 1.5s after the first
                            repeat: Infinity,
                            repeatType: "loop",
                            repeatDelay: 3.0, // 5s total loop
                          }}
                          className="absolute top-8 right-4 left-0 bg-blue-500/80 backdrop-blur rounded-2xl rounded-tl-sm p-3 text-sm text-white font-medium border border-blue-400/30 shadow-lg"
                        >
                          "Found 3 messages. Want a summary?"
                        </motion.div>
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                className: "md:col-span-4",
                children: (
                  <div className="flex flex-col h-full">
                    <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center mb-6">
                      <BarChart3 className="text-violet-600" size={20} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-3">
                      Multi-Model Hub
                    </h3>
                    <p className="text-slate-500 font-medium text-sm leading-relaxed flex-1">
                      Switch between Gemini, ChatGPT, and Claude with one click.
                    </p>
                    <MultiModelHubAnimation />
                  </div>
                ),
              },
              {
                className: "md:col-span-3",
                children: (
                  <div className="flex flex-col h-full">
                    <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center mb-6">
                      <Clock className="text-amber-600" size={20} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-3">
                      Task Extraction
                    </h3>
                    <p className="text-slate-500 font-medium text-sm leading-relaxed">
                      AI pulls deadlines from your inbox directly into your Master To-Do dashboard.
                    </p>
                    <TaskExtractionAnimation />
                  </div>
                ),
              },
            ]}
          />
        </section>

        {/* ─── 5. STATS SECTION ─── */}
        <section className="relative z-10 bg-slate-950 py-20 px-6">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center text-white"
          >
            {[
              { num: "0", label: "Emails Stored on Our Servers" },
              { num: "95%", label: "Time Saved on Email Triage" },
              { num: "$0", label: "Monthly Cost with Your Own Key" },
            ].map(stat => (
              <motion.div key={stat.label} variants={cardFade}>
                <p className="text-5xl font-black tracking-tighter text-white mb-2">{stat.num}</p>
                <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ─── 6. DYNAMIC USE CASES ─── */}
        <StickyScrollUseCases />

        <section id="pricing" className="relative z-10 max-w-5xl mx-auto px-6 py-28">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-950 mb-4">Simple, honest pricing.</h2>
            <p className="text-slate-500 font-medium text-lg mb-10">Start for free. Upgrade when you're ready.</p>

            {/* Magnetic Toggle (Hidden for BYOK layout) */}
            <div className="hidden items-center justify-center">
              <div className="relative flex bg-slate-100 p-1 rounded-full shadow-inner border border-slate-200/60">
                <button
                  onClick={() => setIsAnnual(false)}
                  className={`relative z-10 px-8 py-2.5 rounded-full font-bold text-sm transition-colors ${!isAnnual ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Monthly
                  {!isAnnual && (
                    <motion.div
                      layoutId="pricing-toggle"
                      className="absolute inset-0 bg-white rounded-full shadow-sm border border-slate-200/50"
                      style={{ zIndex: -1 }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
                <button
                  onClick={() => setIsAnnual(true)}
                  className={`relative z-10 px-8 py-2.5 rounded-full font-bold text-sm transition-colors flex items-center gap-2 ${isAnnual ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Annually <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold">Save 20%</span>
                  {isAnnual && (
                    <motion.div
                      layoutId="pricing-toggle"
                      className="absolute inset-0 bg-white rounded-full shadow-sm border border-slate-200/50"
                      style={{ zIndex: -1 }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center"
          >
            {/* Local LLMs Card */}
            <motion.div variants={cardFade} className="bg-white border border-gray-200 rounded-3xl p-10 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
              <p className="text-sm font-extrabold text-slate-400 uppercase tracking-widest mb-4">Local LLMs</p>
              <div className="flex items-end mb-2 h-[60px]">
                <span className="text-5xl font-black text-slate-900">$0</span>
                <span className="text-lg font-bold text-slate-400 mb-1 ml-1">/ forever</span>
              </div>
              <p className="text-slate-500 font-medium text-sm mb-8 leading-relaxed">Totally free and private on your own hardware.</p>
              <ul className="space-y-4 mb-10">
                {["100% Local Processing", "Absolute Privacy", "Zero Subscription Fees", "Offline Support"].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                    <Check size={16} className="text-emerald-500" strokeWidth={3} /> {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => signIn("google")} className="w-full py-3.5 border-2 border-slate-200 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition">
                Get Started Free
              </button>
            </motion.div>

            {/* Cloud LLMs Card (Spotlight) */}
            <SpotlightCard className="bg-white border-2 border-blue-400 rounded-3xl p-10 shadow-[0_10px_60px_rgba(59,130,246,0.15)] overflow-hidden ring-4 ring-blue-500/10 transition-shadow hover:shadow-[0_20px_80px_rgba(59,130,246,0.3)] z-10 scale-105">
              <div className="absolute top-4 right-4 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full z-20">Recommended</div>
              <p className="relative z-20 text-sm font-extrabold text-blue-600 uppercase tracking-widest mb-4">Cloud LLMs</p>

              <div className="relative z-20 flex items-end mb-2 h-[60px] overflow-hidden">
                <span className="text-5xl font-black text-slate-900">$0</span>
                <span className="text-lg font-bold text-slate-400 mb-1 ml-1">/ forever</span>
              </div>

              <div className="relative z-20 inline-block bg-blue-50/80 border border-blue-100 px-3 py-1.5 rounded-lg mb-8">
                <p className="text-blue-700 font-semibold text-xs tracking-wide">Bring your own API key. Pay only for what you use.</p>
              </div>
              <ul className="relative z-20 space-y-4 mb-10">
                {["Bring your Gemini/GPT/Claude key", "Unlimited email syncing", "Unlimited Smart Labels", "AI Chat with Inbox", "Master To-Do Dashboard"].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                    <Check size={16} className="text-blue-600" strokeWidth={3} /> {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => signIn("google")} className="relative z-20 w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40">
                Connect API Key
              </button>
            </SpotlightCard>

            {/* Managed Cloud Card */}
            <motion.div variants={cardFade} className="bg-white border border-gray-200 rounded-3xl p-10 shadow-[0_10px_40px_rgba(0,0,0,0.04)] opacity-70 grayscale-[30%]">
              <p className="text-sm font-extrabold text-slate-400 uppercase tracking-widest mb-4">Managed Cloud</p>
              <div className="flex items-end mb-2 h-[60px]">
                <span className="text-3xl font-black text-slate-400 mt-2 tracking-tight">Coming Soon</span>
              </div>
              <p className="text-slate-500 font-medium text-sm mb-8 leading-relaxed">For users who don't want to manage their own API keys.</p>
              <ul className="space-y-4 mb-10">
                {["One flat monthly fee", "Zero API key setup", "Managed model access", "Enterprise SLA support"].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm font-semibold text-slate-400">
                    <Check size={16} className="text-slate-300" strokeWidth={3} /> {f}
                  </li>
                ))}
              </ul>
              <button disabled className="w-full py-3.5 border-2 border-slate-200 bg-slate-50 rounded-2xl font-bold text-slate-400 cursor-not-allowed">
                Join Waitlist
              </button>
            </motion.div>
          </motion.div>
        </section>



        {/* ─── 9. BOTTOM CTA ─── */}
        <section className="relative z-10 px-6 pt-8 pb-32">
          <motion.div
            {...fadeUp}
            className="max-w-6xl mx-auto rounded-[3.5rem] p-3 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
          >
            <div className="bg-gradient-to-b from-[#35435e] via-[#4d6188] to-[#CDDAED] rounded-[3rem] py-24 px-8 text-center text-white relative overflow-hidden shadow-[inset_0_0_120px_rgba(0,0,0,0.8)]">
              {/* Wireframe Dome Graphic */}
              <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-20 pointer-events-none z-0">
                <svg viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path d="M0 400C0 179.086 179.086 0 400 0C620.914 0 800 179.086 800 400" stroke="white" strokeWidth="1.5" />
                  <path d="M100 400C100 234.315 234.315 100 400 100C565.685 100 700 234.315 700 400" stroke="white" strokeWidth="1.5" />
                  <path d="M200 400C200 289.543 289.543 200 400 200C510.457 200 600 289.543 600 400" stroke="white" strokeWidth="1.5" />
                  <path d="M300 400C300 344.772 344.772 300 400 300C455.228 300 500 344.772 500 400" stroke="white" strokeWidth="1.5" />
                  <path d="M400 0L400 400" stroke="white" strokeWidth="1.5" />
                  <path d="M400 0C300 80 200 200 200 400" stroke="white" strokeWidth="1.5" />
                  <path d="M400 0C500 80 600 200 600 400" stroke="white" strokeWidth="1.5" />
                  <path d="M400 0C350 40 300 150 300 400" stroke="white" strokeWidth="1.5" />
                  <path d="M400 0C450 40 500 150 500 400" stroke="white" strokeWidth="1.5" />
                </svg>
              </div>

              <div className="relative z-10 flex flex-col items-center justify-center">
                <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-8 leading-tight text-white max-w-2xl mx-auto">
                  Build the future of email with Mail-man.
                </h2>

                {/* Sparkle Icon */}
                <div className="mb-12 flex justify-center w-full">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]">
                    <path d="M12 0L13.847 8.153L22 10L13.847 11.847L12 20L10.153 11.847L2 10L10.153 8.153L12 0Z" fill="white" />
                    <path d="M19.5 4.5L18.114 6.886L15.5 8L18.114 9.114L19.5 11.5L20.886 9.114L23.5 8L20.886 6.886L19.5 4.5Z" fill="white" />
                    <path d="M4.5 4.5L3.114 6.886L0.5 8L3.114 9.114L4.5 11.5L5.886 9.114L8.5 8L5.886 6.886L4.5 4.5Z" fill="white" />
                  </svg>
                </div>

                <button
                  onClick={() => signIn("google")}
                  className="bg-white/20 backdrop-blur-xl border border-white/40 text-slate-800 shadow-[0_8px_32px_rgba(30,40,70,0.15)] hover:bg-white/30 hover:scale-105 transition-all duration-300 font-medium text-lg py-4 px-10 md:px-12 rounded-full flex items-center justify-center mx-auto"
                  style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.4) 100%)' }}
                >
                  Get Started Now
                </button>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      {/* ─── 10. FOOTER ─── */}
      <footer ref={footerRef} className="fixed bottom-0 left-0 w-full z-0 border-t border-gray-200 bg-slate-50 pt-32 pb-6 flex flex-col justify-between overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between w-full px-6 gap-16 mb-24 relative z-10">

          {/* Left Side: Mission & Social */}
          <div className="flex flex-col gap-6 max-w-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
                <Mail size={16} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="font-extrabold text-xl text-slate-900 tracking-tight">Mail-man</span>
            </div>
            <p className="text-slate-500 font-medium text-base leading-relaxed">
              Mail-man: Your inbox, tamed by your own AI.
            </p>
            <div className="flex items-center gap-4 mt-2">
              {/* Twitter / X */}
              <a href="#" className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-500 hover:border-blue-500 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" /></svg>
              </a>
              {/* GitHub */}
              <a href="#" className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" /></svg>
              </a>
            </div>
          </div>

          {/* Right Side: Columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-20">
            <div className="flex flex-col gap-4">
              <span className="font-bold text-slate-900 uppercase tracking-widest text-xs mb-1">Product</span>
              <a href="#" className="text-slate-500 hover:text-slate-900 font-medium text-sm transition">Features</a>
              <a href="#pricing" className="text-slate-500 hover:text-slate-900 font-medium text-sm transition">Pricing</a>
              <a href="#" className="text-slate-500 hover:text-slate-900 font-medium text-sm transition">Coming Soon</a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="font-bold text-slate-900 uppercase tracking-widest text-xs mb-1">Legal</span>
              <a href="#" className="text-slate-500 hover:text-slate-900 font-medium text-sm transition">Privacy Policy</a>
              <a href="#" className="text-slate-500 hover:text-slate-900 font-medium text-sm transition">Terms of Service</a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="font-bold text-slate-900 uppercase tracking-widest text-xs mb-1">Connect</span>
              <a href="#" className="text-slate-500 hover:text-slate-900 font-medium text-sm transition">Twitter</a>
              <a href="#" className="text-slate-500 hover:text-slate-900 font-medium text-sm transition">GitHub</a>
              <a href="#" className="text-slate-500 hover:text-slate-900 font-medium text-sm transition">Contact</a>
            </div>
          </div>

        </div>

        {/* Mega Typography Secret Weapon */}
        <div className="w-full relative flex items-center justify-center pointer-events-none mt-auto">
          <h1 className="text-[12vw] font-black tracking-tighter leading-none text-slate-800/40 text-center overflow-hidden mb-[-2vw]">
            MAIL-MAN
          </h1>
        </div>
      </footer>
    </div>
  );
}