"use client";

import React, { useRef } from "react";
import { useScroll, motion, useTransform, useMotionValueEvent } from "framer-motion";
import { BarChart3, Bot, Shield, ChevronRight } from "lucide-react";

const USE_CASES_DATA = [
    {
        icon: <BarChart3 className="text-blue-600" size={32} />,
        bg: "bg-blue-50",
        title: "Founders & Startups",
        desc: "Organize investor updates, pitch deck intros, and customer conversations automatically.",
        details: "Mail-man acts as your chief of staff. Connect your API key and let the AI automatically sort fundraising threads from customer support, extracting action items so you can focus on building.",
    },
    {
        icon: <Bot className="text-violet-600" size={32} />,
        bg: "bg-violet-50",
        title: "Freelancers",
        desc: "Never miss a client follow-up. Extract project deadlines and create tasks from inbound emails.",
        details: "Stop dropping the ball on client communication. Mail-man pulls out deadlines, requested changes, and meeting times directly into your master to-do dashboard.",
    },
    {
        icon: <Shield className="text-emerald-600" size={32} />,
        bg: "bg-emerald-50",
        title: "Enterprise Teams",
        desc: "Classify thousands of emails per team with custom labels, private key vaults, and thread summaries.",
        details: "Scale your email operations with absolute privacy. Mail-man processes everything in-memory using your own LLM keys, ensuring your enterprise data never touches our disks.",
    }
];

export function StickyScrollUseCases() {
    const containerRef = useRef<HTMLDivElement>(null);

    // Track scroll progress within the container
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Map scroll progress to active step index (0, 1, or 2)
    // 0.0 - 0.33 -> 0
    // 0.33 - 0.66 -> 1
    // 0.66 - 1.0 -> 2
    const activeStepFloat = useTransform(scrollYProgress, [0, 1], [0, USE_CASES_DATA.length - 1]);
    const [activeStep, setActiveStep] = React.useState(0);

    useMotionValueEvent(activeStepFloat, "change", (latest) => {
        setActiveStep(Math.round(latest));
    });

    return (
        <section ref={containerRef} className="relative z-10 w-full max-w-6xl mx-auto px-6 py-10 md:py-28">
            <div className="text-center mb-16 md:mb-24">
                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-950 mb-4">
                    The AI inbox built for <span className="text-blue-600">everyone.</span>
                </h2>
                <p className="text-slate-500 font-medium text-lg mt-4 max-w-2xl mx-auto">
                    Whatever you do, Mail-man shapes itself to your workflow. See how different teams leverage custom AI models to save hours every week.
                </p>
            </div>

            <div className="flex flex-col md:flex-row-reverse gap-8 md:gap-16 relative items-start">
                {/* RIGHT SIDE: Scrollable Text Blocks */}
                <div className="w-full md:w-1/2 flex flex-col pt-[10vh] pb-[30vh]">
                    {USE_CASES_DATA.map((item, idx) => (
                        <div
                            key={idx}
                            className={`min-h-[50vh] flex flex-col justify-center transition-all duration-700 ${idx === activeStep ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                                }`}
                        >
                            <div className={`w-16 h-16 ${item.bg} rounded-2xl flex items-center justify-center mb-8 shadow-sm`}>
                                {item.icon}
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 mb-4">{item.title}</h3>
                            <p className="text-xl font-medium text-slate-600 mb-6 leading-relaxed">
                                {item.desc}
                            </p>
                            <p className="text-slate-500 leading-relaxed font-medium">
                                {item.details}
                            </p>

                            <button className="mt-8 flex items-center gap-1 text-sm font-bold text-blue-600 group-hover/card:gap-2 transition-all w-fit px-5 py-2.5 bg-blue-50 rounded-xl hover:bg-blue-100">
                                Learn more <ChevronRight size={16} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* LEFT SIDE: Sticky Visual Container */}
                <div className="hidden md:flex w-1/2 sticky top-32 h-[60vh] items-center justify-center relative z-20 bg-slate-50 border border-slate-100/50 rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200/50 perspective-1000">

                    {/* Isometric Canvas */}
                    <div className="relative w-full h-full flex items-center justify-center scale-90" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(60deg) rotateZ(-45deg)' }}>

                        {/* Base Shadow Floor */}
                        <div className="absolute w-64 h-64 bg-slate-200/50 rounded-3xl blur-2xl -translate-z-[100px]"></div>

                        {/* Layer 0: Founders (Blue) */}
                        <motion.div
                            initial={false}
                            animate={{
                                translateZ: activeStep >= 0 ? 0 : -50,
                                opacity: activeStep >= 0 ? 1 : 0,
                            }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute w-72 h-72 bg-blue-500/20 backdrop-blur-md rounded-[2rem] border-2 border-white/40 shadow-[0_0_40px_rgba(59,130,246,0.1)] flex items-center justify-center"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-[2rem]"></div>
                            {/* Content flipped back up so it faces camera correctly */}
                            <div className="transform rotateZ(45deg) rotateX(-60deg) flex flex-col items-center justify-center">
                                <BarChart3 className="text-blue-500/50 w-24 h-24 stroke-[1]" />
                            </div>
                        </motion.div>

                        {/* Layer 1: Freelancers (Violet) */}
                        <motion.div
                            initial={false}
                            animate={{
                                translateZ: activeStep >= 1 ? 80 : 0,
                                opacity: activeStep >= 1 ? 1 : 0,
                            }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute w-72 h-72 bg-violet-500/20 backdrop-blur-md rounded-[2rem] border-2 border-white/60 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_10px_30px_rgba(139,92,246,0.15)]"
                        >
                            <div className="absolute inset-0 bg-gradient-to-bl from-violet-400/10 to-transparent rounded-[2rem]"></div>
                            <div className="transform rotateZ(45deg) rotateX(-60deg) flex flex-col items-center justify-center">
                                <Bot className="text-violet-500/60 w-24 h-24 stroke-[1.5]" />
                            </div>
                        </motion.div>

                        {/* Layer 2: Enterprise (Emerald) */}
                        <motion.div
                            initial={false}
                            animate={{
                                translateZ: activeStep >= 2 ? 160 : 0,
                                opacity: activeStep >= 2 ? 1 : 0,
                            }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute w-72 h-72 bg-emerald-500/30 backdrop-blur-xl rounded-[2rem] border-[3px] border-white/80 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_20px_40px_rgba(16,185,129,0.2)] flex items-center justify-center"
                        >
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.4),transparent)] rounded-[2rem]"></div>
                            <div className="transform rotateZ(45deg) rotateX(-60deg) flex flex-col items-center justify-center">
                                <Shield className="text-emerald-500/80 w-24 h-24 stroke-[2]" />
                            </div>
                        </motion.div>

                    </div>
                </div>
            </div>
        </section>
    );
}
