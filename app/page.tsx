"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Building2,
  Factory,
  MessageCircle,
  Zap,
  Brain,
  Shield,
  Sun,
  Moon,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Uttam AI",
    description:
      "Our intelligent AI model answers every question about our group with precision.",
    color: "#8b5cf6",
  },
  {
    icon: Building2,
    title: "UISPL Knowledge",
    description:
      "Knows everything about Uttam Innovative Solution — services, team, and more.",
    color: "#0ea5e9",
  },
  {
    icon: Factory,
    title: "Uttam Galva Expert",
    description:
      "Fully informed about Uttam Galva's steel products and industrial solutions.",
    color: "#10b981",
  },
  {
    icon: Zap,
    title: "Real-time Streaming",
    description:
      "Responses stream in real-time for a fast, engaging conversational experience.",
    color: "#f59e0b",
  },
  {
    icon: Sparkles,
    title: "Ultra-Fast Uttam AI",
    description:
      "Powered by our proprietary neural engine for near-instant responses and deep intelligence.",
    color: "#ec4899",
  },
  {
    icon: Shield,
    title: "Company-Focused",
    description:
      "Stays on-topic and only answers questions relevant to your companies.",
    color: "#6366f1",
  },
];

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleThemeChange = (e: any) => {
      const isDark = e.detail === "dark";
      setIsDarkMode(isDark);
    };
    window.addEventListener("theme-change", handleThemeChange);
    return () => window.removeEventListener("theme-change", handleThemeChange);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    if (newTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    window.dispatchEvent(new CustomEvent("theme-change", { detail: newTheme ? "dark" : "light" }));
  };

  if (!mounted) return null;

  return (
    <main
      className={`min-h-screen relative overflow-hidden transition-colors duration-700 ${
        isDarkMode ? "bg-[#050505] text-white" : "bg-[#f8fafc] text-slate-900"
      }`}
      style={{
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* 3D Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20"
          style={{
            background: isDarkMode
              ? "radial-gradient(circle, #4f46e5, transparent)"
              : "radial-gradient(circle, #c7d2fe, transparent)",
          }}
        />
        <motion.div
          animate={{
            rotate: [360, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-15"
          style={{
            background: isDarkMode
              ? "radial-gradient(circle, #7c3aed, transparent)"
              : "radial-gradient(circle, #ddd6fe, transparent)",
          }}
        />
      </div>

      {/* Grid Pattern */}
      <div
        className={`absolute inset-0 opacity-[0.15] pointer-events-none ${
          isDarkMode ? "invert-0" : "invert"
        }`}
        style={{
          backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse at center, black, transparent 80%)",
        }}
      />

      {/* Navigation */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg overflow-hidden">
            <img src="/uttam_ai_logo.png" alt="Uttam AI Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-xl font-bold tracking-tight">Uttam AI</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-xl border transition-all duration-300 ${
              isDarkMode
                ? "bg-white/5 border-white/10 hover:bg-white/10 text-yellow-400"
                : "bg-black/5 border-black/10 hover:bg-black/10 text-indigo-600"
            }`}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("open-chat"))}
            className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 shadow-lg ${
              isDarkMode
                ? "bg-white text-black hover:bg-slate-200"
                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/25"
            }`}
          >
            Launch Chat
          </button>
        </div>
      </nav>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-12 pb-24">
        {/* Hero Section with 3D feel */}
        <div className="flex flex-col lg:flex-row items-center gap-16 mb-32">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center lg:text-left"
          >
            <div
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 ${
                isDarkMode
                  ? "bg-indigo-500/10 border border-indigo-500/30 text-indigo-400"
                  : "bg-indigo-500/10 border border-indigo-500/20 text-indigo-600"
              }`}
            >
              <Zap className="w-3 h-3" /> Next-Gen AI Assistant
            </div>

            <h1 className="text-5xl sm:text-7xl font-extrabold mb-8 leading-[1.1] tracking-tight">
              Intelligence for the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                Future of Industry
              </span>
            </h1>

            <p
              className={`text-lg sm:text-xl max-w-xl mb-10 leading-relaxed ${
                isDarkMode ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Uttam AI provides instant, accurate information about UISPL and Uttam Galva. 
              Bridging IT innovation with Steel manufacturing excellence.
            </p>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent("open-chat"))}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-xl shadow-indigo-500/30 hover:scale-105 transition-transform active:scale-95 flex items-center gap-2"
              >
                Launch Chat <ChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("open-chat", { detail: { message: "Tell me about UISPL AI solutions" } }))}
                className={`px-8 py-4 rounded-2xl font-bold border transition-all ${
                  isDarkMode
                    ? "border-white/10 hover:bg-white/5"
                    : "border-black/10 hover:bg-black/5"
                }`}
              >
                Learn More
              </button>
            </div>
          </motion.div>

          {/* 3D Visual Mockup */}
          <motion.div
            initial={{ opacity: 0, rotateY: 20, scale: 0.9 }}
            animate={{ opacity: 1, rotateY: 0, scale: 1 }}
            transition={{ duration: 1 }}
            className="flex-1 relative hidden lg:block perspective-1000"
          >
            <div className="relative w-full aspect-square max-w-[500px] mx-auto">
              <div
                className={`absolute inset-0 rounded-[40px] transform rotate-3 scale-[1.02] blur-xl opacity-20 ${
                  isDarkMode ? "bg-indigo-500" : "bg-indigo-300"
                }`}
              />
              <div
                className={`absolute inset-0 rounded-[40px] shadow-2xl overflow-hidden border ${
                  isDarkMode
                    ? "bg-black/40 border-white/10 backdrop-blur-2xl"
                    : "bg-white/40 border-black/5 backdrop-blur-2xl"
                }`}
                style={{
                  transform: "rotateX(2deg) rotateY(-5deg)",
                }}
              >
                {/* Simulated UI */}
                <div className="p-8 h-full flex flex-col">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center">
                      <Brain className="text-white" />
                    </div>
                    <div>
                      <div className={`h-4 w-32 rounded-full mb-2 ${isDarkMode ? "bg-white/10" : "bg-black/10"}`} />
                      <div className={`h-2 w-20 rounded-full ${isDarkMode ? "bg-white/5" : "bg-black/5"}`} />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className={`h-24 w-full rounded-3xl ${isDarkMode ? "bg-indigo-500/10 border border-indigo-500/20" : "bg-indigo-50/50 border border-indigo-100"}`} />
                    <div className={`h-32 w-4/5 rounded-3xl ${isDarkMode ? "bg-white/5 border border-white/10" : "bg-slate-100/50 border border-slate-200"}`} />
                    <div className={`h-20 w-full rounded-3xl ${isDarkMode ? "bg-purple-500/10 border border-purple-500/20" : "bg-purple-50/50 border border-purple-100"}`} />
                  </div>
                  <div className="mt-auto flex gap-2">
                    <div className={`h-12 flex-1 rounded-2xl ${isDarkMode ? "bg-white/5" : "bg-black/5"}`} />
                    <div className="h-12 w-12 rounded-2xl bg-indigo-600" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-32">
          {[
            { label: "AI Models", val: "Uttam AI Core" },
            { label: "Accuracy", val: "99.9%" },
            { label: "Engine", val: "Neural Engine" },
            { label: "Response", val: "< 0.5s" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className={`p-6 rounded-3xl text-center border ${
                isDarkMode ? "bg-white/2 border-white/5" : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              <div className="text-2xl font-bold mb-1">{stat.val}</div>
              <div className="text-xs uppercase tracking-widest opacity-50">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-32"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Industrial Grade AI</h2>
            <p className={`max-w-2xl mx-auto ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              Built for precision, scalability, and deep industrial knowledge.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`group p-8 rounded-[32px] border transition-all duration-500 hover:-translate-y-2 ${
                  isDarkMode
                    ? "bg-white/2 border-white/5 hover:bg-white/4 hover:border-white/20"
                    : "bg-white border-slate-200 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-200"
                }`}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:rotate-12"
                  style={{
                    background: `${feature.color}15`,
                    border: `1px solid ${feature.color}30`,
                  }}
                >
                  <feature.icon
                    className="w-7 h-7"
                    style={{ color: feature.color }}
                  />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p
                  className={`leading-relaxed mb-6 ${
                    isDarkMode ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  {feature.description}
                </p>
                <div
                  className={`flex items-center gap-1.5 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    isDarkMode ? "text-white" : "text-indigo-600"
                  }`}
                >
                  Learn more <ChevronRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <footer className={`pt-20 border-t ${isDarkMode ? "border-white/5" : "border-slate-200"}`}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-sm opacity-50">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>&copy; 2026 Uttam Group AI. All rights reserved.</span>
            </div>
            <div className="flex gap-8">
              <a href="#" className="hover:opacity-100 transition-opacity">UISPL</a>
              <a href="#" className="hover:opacity-100 transition-opacity">Uttam Galva</a>
              <a href="#" className="hover:opacity-100 transition-opacity">Privacy</a>
            </div>
          </div>
        </footer>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&display=swap');
        
        .perspective-1000 {
          perspective: 1000px;
        }

        body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }

        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: ${isDarkMode ? "#050505" : "#f8fafc"};
        }
        ::-webkit-scrollbar-thumb {
          background: ${isDarkMode ? "#1f1f1f" : "#cbd5e1"};
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: ${isDarkMode ? "#2f2f2f" : "#94a3b8"};
        }
      `}</style>
    </main>
  );
}
