"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Maximize2,
  Minimize2,
  Volume2,
  Mic,
  Sun,
  Moon,
  MessageCircle,
  X,
  Send,
  User,
  Zap,
  Copy,
  Check,
  Trash2,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  Download,
  Globe,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const QUICK_REPLIES = [
    "Tell me about UISPL",
    "What services do you offer?",
    "What is Uttam Galva?",
    "Contact information",
    "What are your AI solutions?",
    "Current steel price?",
];

const STORAGE_KEY = "uttam_ai_chat_history";

function getFollowUps(userText: string, botText: string): string[] {
    const combined = (userText + " " + botText).toLowerCase();
    if (combined.includes("steel price") || combined.includes("hrc"))
        return ["What is galvanized steel price?", "How does Uttam Galva produce HRC?", "Steel price trend in 2025?"];
    if (combined.includes("uispl") || combined.includes("uttam innovative"))
        return ["What services does UISPL offer?", "Who are the directors of UISPL?", "What is LoopSteel AI?"];
    if (combined.includes("uttam galva"))
        return ["What products does Uttam Galva make?", "Current steel price?", "How to contact Uttam Galva?"];
    return ["Tell me about UISPL", "What is the current steel price?", "How can I contact Uttam Galva?"];
}

function formatTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [showQuickReplies, setShowQuickReplies] = useState(true);
    const [theme, setTheme] = useState<"dark" | "light">("dark");
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [input, setInput] = useState("");
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [timestamps] = useState<Map<string, Date>>(new Map());
    const [unreadCount, setUnreadCount] = useState(0);
    const [reactions, setReactions] = useState<Record<string, "up" | "down">>({});
    const [webSearchEnabled, setWebSearchEnabled] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const playSound = (type: "send" | "receive") => {
        try {
            const audio = new Audio(
                type === "send"
                    ? "https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3"
                    : "https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3"
            );
            audio.volume = 0.15;
            audio.play().catch(() => {});
        } catch (e) { }
    };

    const savedMessages = typeof window !== "undefined"
        ? (() => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; } })()
        : [];

    const { messages, sendMessage, status, error, setMessages } = useChat({
        transport: new DefaultChatTransport({ api: "/api/chat" }),
    });

    const isLoading = status === "submitted" || status === "streaming";

    const scrollToBottom = (instant = false) => {
        if (!messagesEndRef.current) return;
        const container = messagesEndRef.current.parentElement;
        if (container) {
            container.scrollTo({
                top: container.scrollHeight,
                behavior: instant ? "auto" : "smooth"
            });
        }
    };

    // Load history on mount
    useEffect(() => {
        if (savedMessages.length > 0 && messages.length === 0) {
            setMessages(savedMessages);
            setTimeout(() => scrollToBottom(true), 100);
        }
    }, []);

    useEffect(() => {
        if (status === "streaming") {
            const container = messagesEndRef.current?.parentElement;
            if (container) {
                // Fluid scroll during streaming
                container.scrollTop = container.scrollHeight;
            }
        } else {
            scrollToBottom();
        }

        if (!isOpen && messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.role === "assistant") {
                setUnreadCount(prev => prev + 1);
                playSound("receive");
            }
        }
    }, [messages, isOpen]);

    useEffect(() => {
        if (isOpen) setUnreadCount(0);
    }, [isOpen]);

    useEffect(() => {
        if (messages.length > 0) {
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages)); } catch { }
        }
    }, [messages]);

    useEffect(() => {
        messages.forEach((m) => {
            if (!timestamps.has(m.id)) timestamps.set(m.id, new Date());
        });
    }, [messages]);

    const getMessageText = (message: any): string =>
        message.parts
            ? message.parts.filter((p: any) => p.type === "text").map((p: any) => p.text).join("")
            : (message.content ?? "");

    const sendUserMessage = async (content: string) => {
        if (!content.trim() || isLoading) return;
        setShowQuickReplies(false);
        setInput("");
        playSound("send");
        try {
            await sendMessage({ text: content }, { body: { webSearch: webSearchEnabled } });
        } catch (err) {
            console.error("Failed to send message:", err);
            setInput(content);
        }
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        sendUserMessage(input);
    };

    const exportChat = () => {
        const text = messages.map(m => `${m.role.toUpperCase()} [${formatTime(timestamps.get(m.id) || new Date())}]: ${getMessageText(m)}`).join("\n\n");
        const blob = new Blob([text], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Uttam-AI-Chat-${new Date().toLocaleDateString()}.txt`;
        a.click();
    };

    const handleReaction = (messageId: string, type: "up" | "down") => setReactions(prev => ({ ...prev, [messageId]: type }));

    const clearChat = () => {
        setMessages([]);
        setShowQuickReplies(true);
        try { localStorage.removeItem(STORAGE_KEY); } catch { }
    };

    const copyMessage = async (id: string, text: string) => {
        await navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    useEffect(() => {
        if (isOpen) document.body.style.overflow = isFullScreen ? "hidden" : "auto";
    }, [isOpen, isFullScreen]);

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        document.documentElement.classList.toggle("dark");
    };

    const toggleVoiceOutput = () => {
        if (isSpeaking) { window.speechSynthesis.cancel(); setIsSpeaking(false); }
        else setIsSpeaking(true);
    };

    // Voice output effect with Indian voice logic
    useEffect(() => {
        if (!isSpeaking || messages.length === 0 || isLoading) return;
        const last = messages[messages.length - 1];
        if (last.role !== "assistant") return;
        const text = getMessageText(last);
        if (!text) return;

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        
        const speak = () => {
            const voices = window.speechSynthesis.getVoices();
            // Find Indian English or Hindi voice
            const v = voices.find(v => 
                (v.lang.includes("IN") || v.name.includes("India") || v.name.includes("Indian")) &&
                (v.lang.startsWith("en") || v.lang.startsWith("hi"))
            );
            if (v) utterance.voice = v;
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            window.speechSynthesis.speak(utterance);
        };

        if (window.speechSynthesis.getVoices().length === 0) {
            window.speechSynthesis.onvoiceschanged = speak;
        } else {
            speak();
        }
    }, [messages, isSpeaking, isLoading]);

    const toggleVoiceInput = () => {
        if (isListening) {
            setIsListening(false);
            (window as any)._recognition?.stop();
            return;
        }
        const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SR) return;
        const r = new SR();
        r.lang = "en-IN"; r.continuous = false; r.interimResults = false;
        r.onstart = () => setIsListening(true);
        r.onend = () => setIsListening(false);
        r.onresult = (e: any) => sendUserMessage(e.results[0][0].transcript);
        (window as any)._recognition = r;
        r.start();
    };

    const isDark = theme === "dark";
    const lastAssistantMessage = [...messages].reverse().find(m => m.role === "assistant");
    const lastUserMessage = [...messages].reverse().find(m => m.role === "user");
    const followUps = lastAssistantMessage && !isLoading
        ? getFollowUps(
            getMessageText(lastUserMessage || { parts: [] }),
            getMessageText(lastAssistantMessage)
          )
        : [];

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 40, scale: 0.8 }}
                        className={`fixed z-50 shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${isFullScreen
                            ? "inset-0 w-full h-full rounded-none"
                            : "bottom-0 left-0 right-0 h-full sm:h-[min(850px,calc(100vh-100px))] sm:bottom-6 sm:right-6 sm:left-auto sm:w-[480px] rounded-none sm:rounded-[2.5rem]"
                            }`}
                        style={{
                            background: isDark ? "#0a0a0a" : "#ffffff",
                            border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
                        }}
                    >
                        {/* Header Handle for Mobile */}
                        <div className="w-12 h-1.5 bg-slate-500/20 rounded-full mx-auto mt-3 mb-1 sm:hidden" />
                        {/* Header */}
                        <div className={`p-4 flex items-center justify-between border-b shrink-0 ${isDark ? "border-white/10" : "border-slate-200"}`}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg overflow-hidden">
                                    <img src="/uttam_ai_logo.png" alt="Logo" className="w-full h-full object-cover"
                                        onError={(e) => { (e.target as any).src = "https://ui-avatars.com/api/?name=U&background=4f46e5&color=fff"; }} />
                                </div>
                                <div>
                                    <h3 className={`font-bold text-sm ${isDark ? "text-white" : "text-slate-800"}`}>Uttam AI</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="text-[10px] text-green-500 font-medium tracking-wider uppercase flex items-center gap-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Online
                                        </div>
                                        {webSearchEnabled && (
                                            <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                                                className="text-[9px] text-indigo-400 font-bold uppercase flex items-center gap-1 px-1.5 py-0.5 bg-indigo-500/10 rounded-md border border-indigo-500/20">
                                                <Globe size={8} className="animate-pulse" /> Web Search
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button onClick={exportChat} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400" title="Export Chat">
                                    <Download size={16} />
                                </button>
                                <button onClick={toggleVoiceOutput} title="Voice output" className={`p-2 rounded-lg transition-colors ${isSpeaking ? "text-indigo-500 bg-indigo-500/10" : "text-slate-400 hover:bg-slate-500/10"}`}>
                                    <Volume2 size={16} />
                                </button>
                                <button onClick={toggleTheme} title="Toggle theme" className="p-2 text-slate-400 hover:bg-slate-500/10 rounded-lg transition-colors">
                                    {isDark ? <Sun size={16} /> : <Moon size={16} />}
                                </button>
                                {messages.length > 0 && (
                                    <button onClick={clearChat} title="Clear chat" className="p-2 text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                )}
                                <button onClick={() => setIsFullScreen(!isFullScreen)} title="Toggle fullscreen" className="hidden sm:flex p-2 text-slate-400 hover:bg-slate-500/10 rounded-lg transition-colors">
                                    {isFullScreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                                </button>
                                <button onClick={() => setIsOpen(false)} className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-white/5 text-slate-400" : "hover:bg-black/5 text-slate-500"}`}>
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
                            {messages.length === 0 && (
                                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                    className={`p-6 rounded-3xl border ${isDark ? "bg-white/3 border-white/5" : "bg-slate-50 border-slate-100"}`}>
                                    <h4 className={`font-bold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>Welcome to Uttam Group 👋</h4>
                                    <p className={`text-sm leading-relaxed ${isDark ? "text-white/50" : "text-slate-500"}`}>
                                        I&apos;m your AI assistant for <span className="text-indigo-400 font-bold">UISPL</span> &amp; <span className="text-indigo-400 font-bold">Uttam Galva</span>.
                                    </p>
                                </motion.div>
                            )}

                            {messages.map((message: any, i: number) => {
                                const text = getMessageText(message);
                                const isUser = message.role === "user";
                                const time = timestamps.get(message.id);
                                return (
                                    <motion.div key={message.id || i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 shadow-sm ${isUser ? "bg-indigo-600 text-white" : isDark ? "bg-white/10 text-white" : "bg-slate-900 text-white"}`}>
                                            {isUser ? <User size={14} /> : <img src="/favicon.svg" alt="Bot" className="w-5 h-5" />}
                                        </div>

                                        <div className={`flex flex-col gap-1 max-w-[80%] ${isUser ? "items-end" : "items-start"}`}>
                                            <div className={`group relative px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${isUser
                                                ? "bg-indigo-600 text-white rounded-tr-none"
                                                : isDark ? "bg-white/6 text-white border border-white/5 rounded-tl-none" : "bg-white text-slate-800 border border-slate-200 rounded-tl-none"
                                                }`}>
                                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                        {text}
                                                    </ReactMarkdown>
                                                    {status === "streaming" && !isUser && i === messages.length - 1 && (
                                                        <motion.span
                                                            animate={{ opacity: [1, 0, 1] }}
                                                            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                                                            className="inline-block w-2 h-4 bg-indigo-500 ml-1 translate-y-0.5"
                                                        />
                                                    )}
                                                </div>
                                                {!isUser && (
                                                    <div className="flex gap-1.5 mt-3 pt-2 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => copyMessage(message.id, text)} className="p-1 hover:bg-white/10 rounded transition-colors text-slate-400" title="Copy Message">
                                                            {copiedId === message.id ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                                                        </button>
                                                        <button onClick={() => handleReaction(message.id, "up")} className={`p-1 rounded hover:bg-white/10 transition-colors ${reactions[message.id] === "up" ? "text-green-400" : "text-slate-400"}`}>
                                                            <ThumbsUp size={12} />
                                                        </button>
                                                        <button onClick={() => handleReaction(message.id, "down")} className={`p-1 rounded hover:bg-white/10 transition-colors ${reactions[message.id] === "down" ? "text-red-400" : "text-slate-400"}`}>
                                                            <ThumbsDown size={12} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            {time && <span className="text-[10px] opacity-30 px-2 italic">{formatTime(time)}</span>}
                                        </div>
                                    </motion.div>
                                );
                            })}
                            
                            {isLoading && (
                                <div className="flex gap-3">
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isDark ? "bg-white/10" : "bg-slate-900"} text-white shadow-sm`}>
                                        <img src="/favicon.svg" alt="Bot" className="w-5 h-5" />
                                    </div>
                                    <div className={`px-5 py-3.5 rounded-2xl rounded-tl-none ${isDark ? "bg-white/6 border border-white/5" : "bg-white border border-slate-200"} flex items-center gap-2`}>
                                        <div className="flex gap-1">
                                            <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                            <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.15 }} className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                            <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }} className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                        </div>
                                        <span className="text-xs opacity-40 font-medium">
                                            {webSearchEnabled ? "Searching the web..." : "Thinking..."}
                                        </span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Suggestions & Input */}
                        <div className={`p-4 sm:p-6 shrink-0 ${isDark ? "bg-black/40" : "bg-slate-50/50"} backdrop-blur-md border-t ${isDark ? "border-white/5" : "border-slate-100"} safe-area-bottom`}>
                            {followUps.length > 0 && !isLoading && (
                                <div className="flex flex-nowrap overflow-x-auto no-scrollbar gap-2 mb-4 pb-1">
                                    {followUps.map((q) => (
                                        <button key={q} onClick={() => sendUserMessage(q)}
                                            className={`text-[11px] whitespace-nowrap px-3 py-2 rounded-xl font-medium flex items-center gap-1 transition-all active:scale-95 ${isDark ? "bg-indigo-500/10 border border-indigo-500/20 text-indigo-300" : "bg-white border border-slate-200 text-indigo-600 shadow-sm"}`}>
                                            {q} <ChevronRight size={10} />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {showQuickReplies && messages.length === 0 && (
                                <div className="flex flex-nowrap overflow-x-auto no-scrollbar gap-2 mb-4 pb-1">
                                    {QUICK_REPLIES.map((reply) => (
                                        <button key={reply} onClick={() => sendUserMessage(reply)}
                                            className={`text-xs whitespace-nowrap px-3.5 py-2.5 rounded-2xl font-medium transition-all active:scale-95 ${isDark ? "bg-white/5 border border-white/10 text-white/70" : "bg-white border border-slate-200 text-slate-600 shadow-sm"}`}>
                                            {reply}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <form onSubmit={handleFormSubmit} className="flex gap-2 items-center">
                                <button type="button" onClick={toggleVoiceInput}
                                    className={`p-4 rounded-2xl flex items-center justify-center transition-all ${isListening ? "bg-red-500 text-white animate-pulse" : isDark ? "bg-white/5 text-slate-400" : "bg-slate-100 text-slate-500"}`}>
                                    <Mic size={20} />
                                </button>
                                <div className="relative flex-1">
                                    <input type="text" value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        maxLength={500}
                                        placeholder="Ask anything..."
                                        disabled={isLoading}
                                        className={`w-full text-[16px] sm:text-sm outline-none rounded-2xl px-4 py-4 pr-20 transition-all ${isDark ? "bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:border-indigo-500/50" : "bg-white border border-slate-200 text-slate-900 focus:border-indigo-400"}`} />
                                    
                                    <button
                                        type="button"
                                        onClick={() => setWebSearchEnabled(!webSearchEnabled)}
                                        title={webSearchEnabled ? "Web Search ON" : "Web Search OFF"}
                                        className={`absolute right-12 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${webSearchEnabled ? "text-indigo-400 bg-indigo-500/10 ring-1 ring-indigo-500/30" : "text-slate-400"}`}
                                    >
                                        <Globe size={18} />
                                    </button>

                                    <div className="absolute -top-6 right-0 text-[9px] opacity-20 font-mono tracking-tighter">{input.length}/500</div>
                                    <button type="submit" disabled={isLoading || !input.trim()}
                                        className={`absolute right-2 top-2 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${input.trim() && !isLoading ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30" : "bg-slate-400/20 text-slate-500 cursor-not-allowed"}`}>
                                        <Send size={18} />
                                    </button>
                                </div>
                            </form>
                            <div className="mt-4 flex items-center justify-center gap-1 opacity-20">
                                <Zap size={10} />
                                <span className="text-[9px] font-bold uppercase tracking-widest">Powered by Uttam AI</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {!isOpen && (
                <motion.button onClick={() => setIsOpen(true)}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl bg-linear-to-br from-indigo-600 to-purple-600"
                    whileHover={{ scale: 1.1, y: -4 }}
                    whileTap={{ scale: 0.9 }}>
                    <div className="relative flex items-center justify-center">
                        <MessageCircle className="w-8 h-8 text-white" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-3 -right-3 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-black shadow-lg animate-bounce">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                </motion.button>
            )}
        </>
    );
}