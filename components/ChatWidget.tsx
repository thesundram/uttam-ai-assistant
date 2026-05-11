"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Maximize2, Minimize2, Volume2, Mic, Sun, Moon,
  MessageCircle, X, Send, User, Zap, Copy, Check,
  Trash2, ChevronRight, ThumbsUp, ThumbsDown, Download,
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
// hello
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

function getMessageText(message: any): string {
  if (message.parts) {
    const text = message.parts.filter((p: any) => p.type === "text").map((p: any) => p.text).join("");
    if (text) return text;
  }
  if (typeof message.content === "string") return message.content;
  if (Array.isArray(message.content)) return message.content.filter((p: any) => p.type === "text").map((p: any) => p.text).join("");
  return "";
}

const messageVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 28 } },
} as const;

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

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const playSound = (type: "send" | "receive") => {
    try {
      const audio = new Audio(
        type === "send"
          ? "https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3"
          : "https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3"
      );
      audio.volume = 0.15;
      audio.play().catch(() => {});
    } catch (e) {}
  };

  const savedMessages = typeof window !== "undefined"
    ? (() => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; } })()
    : [];

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const isLoading = status === "submitted" || status === "streaming";

  const scrollToBottom = (instant = false) => {
    const container = messagesContainerRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: instant ? "auto" : "smooth" });
  };

  useEffect(() => {
    if (savedMessages.length > 0 && messages.length === 0) {
      setMessages(savedMessages);
      setTimeout(() => scrollToBottom(true), 100);
    }
  }, []);

  useEffect(() => {
    if (status === "streaming") {
      const container = messagesContainerRef.current;
      if (container) container.scrollTop = container.scrollHeight;
    } else {
      scrollToBottom();
    }
    if (!isOpen && messages.length > 0) {
      const last = messages[messages.length - 1];
      if (last.role === "assistant") {
        setUnreadCount(prev => prev + 1);
        playSound("receive");
      }
    }
  }, [messages, isOpen]);

  useEffect(() => { if (isOpen) setUnreadCount(0); }, [isOpen]);

  useEffect(() => {
    if (messages.length > 0) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages)); } catch {}
    }
  }, [messages]);

  useEffect(() => {
    messages.forEach((m) => { if (!timestamps.has(m.id)) timestamps.set(m.id, new Date()); });
  }, [messages]);

  const sendUserMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;
    setShowQuickReplies(false);
    setInput("");
    playSound("send");
    try { await sendMessage({ text: content }); }
    catch (err) { setInput(content); }
  };

  const exportChat = () => {
    const text = messages.map(m => `${m.role.toUpperCase()} [${formatTime(timestamps.get(m.id) || new Date())}]: ${getMessageText(m)}`).join("\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `Uttam-AI-Chat-${new Date().toLocaleDateString()}.txt`; a.click();
  };

  const clearChat = () => {
    setMessages([]); setShowQuickReplies(true);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  };

  const copyMessage = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id); setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleTheme = () => { setTheme(t => t === "dark" ? "light" : "dark"); };

  const toggleVoiceOutput = () => {
    if (isSpeaking) { window.speechSynthesis.cancel(); setIsSpeaking(false); }
    else setIsSpeaking(true);
  };

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
      const v = voices.find(v => (v.lang.includes("IN") || v.name.includes("India")) && (v.lang.startsWith("en") || v.lang.startsWith("hi")));
      if (v) utterance.voice = v;
      utterance.rate = 1.0; utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    };
    if (window.speechSynthesis.getVoices().length === 0) window.speechSynthesis.onvoiceschanged = speak;
    else speak();
  }, [messages, isSpeaking, isLoading]);

  const toggleVoiceInput = () => {
    if (isListening) { setIsListening(false); (window as any)._recognition?.stop(); return; }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const r = new SR();
    r.lang = "en-IN"; r.continuous = false; r.interimResults = false;
    r.onstart = () => setIsListening(true);
    r.onend = () => setIsListening(false);
    r.onresult = (e: any) => sendUserMessage(e.results[0][0].transcript);
    (window as any)._recognition = r; r.start();
  };

  const isDark = theme === "dark";
  const lastAssistantMessage = [...messages].reverse().find(m => m.role === "assistant");
  const lastUserMessage = [...messages].reverse().find(m => m.role === "user");
  const followUps = lastAssistantMessage && !isLoading
    ? getFollowUps(getMessageText(lastUserMessage || { parts: [] }), getMessageText(lastAssistantMessage))
    : [];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className={`fixed z-50 shadow-2xl overflow-hidden flex flex-col ${isFullScreen
              ? "inset-0 w-full h-full rounded-none"
              : "bottom-0 left-0 right-0 h-full sm:h-[min(850px,calc(100vh-100px))] sm:bottom-6 sm:right-6 sm:left-auto sm:w-[480px] rounded-none sm:rounded-[2.5rem]"
              }`}
            style={{
              background: isDark ? "#0a0a0a" : "#ffffff",
              border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)",
            }}
          >
            {/* Mobile drag handle */}
            <div className="w-12 h-1.5 bg-slate-500/20 rounded-full mx-auto mt-3 mb-1 sm:hidden" />

            {/* Header */}
            <div className={`px-4 py-3 flex items-center justify-between border-b shrink-0 ${isDark ? "border-white/8" : "border-slate-100"}`}>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg overflow-hidden">
                    <img src="/uttam_ai_logo.png" alt="Logo" className="w-full h-full object-cover"
                      onError={(e) => { (e.target as any).src = "https://ui-avatars.com/api/?name=U&background=4f46e5&color=fff"; }} />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
                </div>
                <div>
                  <h3 className={`font-bold text-sm ${isDark ? "text-white" : "text-slate-800"}`}>Uttam AI</h3>
                  <p className="text-[10px] text-green-500 font-medium">Online • Web Search Active</p>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                <button onClick={exportChat} className="p-2 rounded-lg hover:bg-white/8 text-slate-400 transition-colors" title="Export">
                  <Download size={15} />
                </button>
                <button onClick={toggleVoiceOutput} className={`p-2 rounded-lg transition-colors ${isSpeaking ? "text-indigo-400 bg-indigo-500/10" : "text-slate-400 hover:bg-white/8"}`}>
                  <Volume2 size={15} />
                </button>
                <button onClick={toggleTheme} className="p-2 text-slate-400 hover:bg-white/8 rounded-lg transition-colors">
                  {isDark ? <Sun size={15} /> : <Moon size={15} />}
                </button>
                {messages.length > 0 && (
                  <button onClick={clearChat} className="p-2 text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors">
                    <Trash2 size={15} />
                  </button>
                )}
                <button onClick={() => setIsFullScreen(!isFullScreen)} className="hidden sm:flex p-2 text-slate-400 hover:bg-white/8 rounded-lg transition-colors">
                  {isFullScreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                </button>
                <button onClick={() => setIsOpen(false)} className="p-2 text-slate-400 hover:bg-white/8 rounded-lg transition-colors">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-4 scroll-smooth">
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className={`p-5 rounded-2xl border ${isDark ? "bg-white/3 border-white/5" : "bg-slate-50 border-slate-100"}`}
                >
                  <h4 className={`font-bold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>Welcome to Uttam Group 👋</h4>
                  <p className={`text-sm leading-relaxed ${isDark ? "text-white/50" : "text-slate-500"}`}>
                    I&apos;m your AI assistant for <span className="text-indigo-400 font-semibold">UISPL</span> &amp; <span className="text-indigo-400 font-semibold">Uttam Galva</span>. Ask me anything!
                  </p>
                </motion.div>
              )}

              <AnimatePresence initial={false}>
                {messages.map((message: any, i: number) => {
                  const text = getMessageText(message);
                  const isUser = message.role === "user";
                  const time = timestamps.get(message.id);
                  const isLastAssistant = !isUser && i === messages.length - 1;

                  return (
                    <motion.div
                      key={message.id || i}
                      variants={messageVariants}
                      initial="hidden"
                      animate="visible"
                      className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                    >
                      {/* Avatar */}
                      <motion.div
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.05 }}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 ${isUser
                          ? "bg-indigo-600 text-white"
                          : isDark ? "bg-white/10 text-white" : "bg-slate-900 text-white"
                          }`}
                      >
                        {isUser ? <User size={13} /> : <img src="/favicon.svg" alt="Bot" className="w-4 h-4" />}
                      </motion.div>

                      <div className={`flex flex-col gap-1 max-w-[82%] ${isUser ? "items-end" : "items-start"}`}>
                        <div className={`group relative px-4 py-3 rounded-2xl text-sm leading-relaxed ${isUser
                          ? "bg-indigo-600 text-white rounded-tr-sm"
                          : isDark
                            ? "bg-white/6 text-white/90 border border-white/6 rounded-tl-sm"
                            : "bg-white text-slate-800 border border-slate-100 shadow-sm rounded-tl-sm"
                          }`}
                        >
                          {/* Markdown content */}
                          <div className={`prose prose-sm max-w-none ${isDark ? "prose-invert" : ""} 
                            prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5
                            prose-code:text-indigo-400 prose-code:bg-white/10 prose-code:px-1 prose-code:rounded
                            prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline
                            prose-strong:text-white prose-blockquote:border-indigo-500`}
                          >
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
                            {/* Streaming cursor */}
                            {status === "streaming" && isLastAssistant && (
                              <motion.span
                                animate={{ opacity: [1, 0] }}
                                transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
                                className="inline-block w-0.5 h-4 bg-indigo-400 ml-0.5 translate-y-0.5 rounded-full"
                              />
                            )}
                          </div>

                          {/* Action buttons on hover */}
                          {!isUser && text && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              whileHover={{ opacity: 1 }}
                              className="flex gap-1 mt-2 pt-2 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            >
                              <button onClick={() => copyMessage(message.id, text)}
                                className="p-1 hover:bg-white/10 rounded-md transition-colors text-slate-400 hover:text-white">
                                {copiedId === message.id ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}
                              </button>
                              <button onClick={() => setReactions(p => ({ ...p, [message.id]: "up" }))}
                                className={`p-1 rounded-md hover:bg-white/10 transition-colors ${reactions[message.id] === "up" ? "text-green-400" : "text-slate-400"}`}>
                                <ThumbsUp size={11} />
                              </button>
                              <button onClick={() => setReactions(p => ({ ...p, [message.id]: "down" }))}
                                className={`p-1 rounded-md hover:bg-white/10 transition-colors ${reactions[message.id] === "down" ? "text-red-400" : "text-slate-400"}`}>
                                <ThumbsDown size={11} />
                              </button>
                            </motion.div>
                          )}
                        </div>
                        {time && <span className="text-[10px] opacity-25 px-1">{formatTime(time)}</span>}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Typing indicator */}
              <AnimatePresence>
                {isLoading && status === "submitted" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="flex gap-2.5"
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isDark ? "bg-white/10" : "bg-slate-900"} text-white`}>
                      <img src="/favicon.svg" alt="Bot" className="w-4 h-4" />
                    </div>
                    <div className={`px-4 py-3 rounded-2xl rounded-tl-sm ${isDark ? "bg-white/6 border border-white/6" : "bg-white border border-slate-100 shadow-sm"} flex items-center gap-1.5`}>
                      {[0, 0.15, 0.3].map((delay, i) => (
                        <motion.div key={i}
                          animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
                          transition={{ repeat: Infinity, duration: 0.7, delay }}
                          className="w-1.5 h-1.5 rounded-full bg-indigo-400"
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className={`px-4 py-4 shrink-0 border-t ${isDark ? "border-white/6 bg-black/30" : "border-slate-100 bg-slate-50/80"} backdrop-blur-md`}>

              {/* Follow-up suggestions */}
              <AnimatePresence>
                {followUps.length > 0 && !isLoading && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                    className="flex flex-nowrap overflow-x-auto no-scrollbar gap-2 mb-3"
                  >
                    {followUps.map((q, i) => (
                      <motion.button key={q}
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => sendUserMessage(q)}
                        className={`text-[11px] whitespace-nowrap px-3 py-1.5 rounded-xl font-medium flex items-center gap-1 transition-all active:scale-95 ${isDark
                          ? "bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/20"
                          : "bg-white border border-slate-200 text-indigo-600 shadow-sm hover:border-indigo-300"
                          }`}>
                        {q} <ChevronRight size={9} />
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Quick replies */}
              {showQuickReplies && messages.length === 0 && (
                <div className="flex flex-nowrap overflow-x-auto no-scrollbar gap-2 mb-3">
                  {QUICK_REPLIES.map((reply, i) => (
                    <motion.button key={reply}
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      onClick={() => sendUserMessage(reply)}
                      className={`text-xs whitespace-nowrap px-3 py-2 rounded-xl font-medium transition-all active:scale-95 ${isDark
                        ? "bg-white/5 border border-white/8 text-white/60 hover:bg-white/10"
                        : "bg-white border border-slate-200 text-slate-600 shadow-sm hover:border-slate-300"
                        }`}>
                      {reply}
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Input form */}
              <form onSubmit={(e) => { e.preventDefault(); sendUserMessage(input); }} className="flex gap-2 items-center">
                <button type="button" onClick={toggleVoiceInput}
                  className={`p-3 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${isListening
                    ? "bg-red-500 text-white animate-pulse"
                    : isDark ? "bg-white/5 text-slate-400 hover:bg-white/10" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}>
                  <Mic size={18} />
                </button>

                <div className="relative flex-1">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); sendUserMessage(input); } }}
                    maxLength={500}
                    placeholder="Ask anything..."
                    disabled={isLoading}
                    className={`w-full text-[16px] sm:text-sm outline-none rounded-xl px-4 py-3 pr-12 transition-all ${isDark
                      ? "bg-white/5 border border-white/8 text-white placeholder:text-white/20 focus:border-indigo-500/40"
                      : "bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-300"
                      }`}
                  />
                  <div className="absolute right-1 top-1/2 -translate-y-1/2">
                    <motion.button
                      type="submit"
                      disabled={isLoading || !input.trim()}
                      whileTap={{ scale: 0.9 }}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${input.trim() && !isLoading
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-500"
                        : "bg-slate-400/15 text-slate-500 cursor-not-allowed"
                        }`}>
                      <Send size={15} />
                    </motion.button>
                  </div>
                </div>
              </form>

              <div className="mt-2 flex items-center justify-center gap-1 opacity-20">
                <Zap size={9} />
                <span className="text-[9px] font-bold uppercase tracking-widest">Powered by Uttam AI</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB button */}
      {!isOpen && (
        <motion.button
          onClick={() => setIsOpen(true)}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.08, y: -3 }}
          whileTap={{ scale: 0.92 }}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl bg-gradient-to-br from-indigo-600 to-purple-600"
        >
          <div className="relative">
            <MessageCircle className="w-7 h-7 text-white" />
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                  className="absolute -top-2.5 -right-2.5 bg-red-500 text-white text-[9px] font-bold w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center border-2 border-black"
                >
                  {unreadCount}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </motion.button>
      )}
    </>
  );
}
