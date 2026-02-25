"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowRight } from "lucide-react";

/**
 * Text Reveal / Typewriter Effect for the Main Headline
 */
const TypewriterText = ({ text, className = "" }: { text: string; className?: string }) => {
    const words = text.split(" ");
    return (
        <div className={`inline-block ${className}`}>
            {words.map((word, index) => (
                <motion.span
                    key={index}
                    initial={{ opacity: 0, filter: "blur(8px)", y: 10 }}
                    animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.15, ease: "easeOut" }}
                    className="inline-block mr-[0.25em]"
                >
                    {word}
                </motion.span>
            ))}
        </div>
    );
};

/**
 * Animated Search Input with Cycling Placeholders
 */
const AnimatedSearchInput = () => {
    const placeholders = [
        "Summarize my unread emails...",
        "Find the invoice from Adobe...",
        "Draft a polite reply to The Hindu...",
    ];

    const [current, setCurrent] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [value, setValue] = useState("");

    useEffect(() => {
        // Only cycle placeholders if the user hasn't typed anything
        if (value) return;

        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % placeholders.length);
        }, 4000); // 4 seconds per placeholder

        return () => clearInterval(interval);
    }, [placeholders.length, value]);

    return (
        <div className="relative w-full max-w-3xl mx-auto h-16 md:h-18 bg-white border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-2xl flex items-center px-4 md:px-6 overflow-hidden focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all duration-300">
            <Search className="text-gray-400 mr-3 w-6 h-6 shrink-0" />

            <div className="relative flex-1 h-full flex items-center">
                {/* Actual Input */}
                <input
                    type="text"
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                        setIsTyping(e.target.value.length > 0);
                    }}
                    className="w-full h-full bg-transparent border-none outline-none text-gray-900 text-lg md:text-xl font-medium relative z-10 placeholder-transparent"
                />

                {/* Animated Placeholders (only visible when empty) */}
                {!isTyping && (
                    <div className="absolute inset-0 flex items-center pointer-events-none overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={current}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="text-gray-400 text-lg md:text-xl font-medium truncate"
                            >
                                {placeholders[current]}
                            </motion.span>
                        </AnimatePresence>
                    </div>
                )}
            </div>

            <button className="ml-4 w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center justify-center text-white transition-colors shrink-0 shadow-md">
                <ArrowRight className="w-5 h-5" />
            </button>
        </div>
    );
};

/**
 * Main Hero Component (Light Mode)
 */
export default function HeroLight() {
    return (
        <section className="relative w-full min-h-[70vh] flex flex-col items-center justify-center bg-transparent py-24 px-4 overflow-hidden selection:bg-blue-100">

            <div className="text-center max-w-5xl mx-auto z-10 w-full">

                {/* Main Headline with Word-by-Word Reveal */}
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-extrabold text-gray-900 tracking-tight leading-tight mb-8">
                    <TypewriterText text="AI Powered Email, Built to Save You Time" />
                </h1>

                {/* Sub-headline animating shortly after H1 starts */}
                <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.9, ease: "easeOut" }}
                    className="text-xl md:text-2xl text-gray-500 mb-14 max-w-3xl mx-auto font-medium leading-relaxed"
                >
                    Connect your own AI keys. Get intelligent summaries, auto-extracted tasks, and perfect draft replies instantly.
                </motion.p>

                {/* Search Bar animating after Text finishes */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.4, ease: "easeOut" }}
                    className="w-full"
                >
                    <AnimatedSearchInput />
                </motion.div>

            </div>
        </section>
    );
}
