"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from 'react-markdown';

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Initial greeting
  useEffect(() => {
  if (messages.length === 0) {
    setMessages([
      { 
        role: "ai", 
        text: `🎓 **Congratulations, Iskolar!** Welcome to the official **Aninag 2026** portal. I'm here to ensure your graduation photoshoot experience is as seamless as possible.

How can I assist you today? You can ask me about:
✨ **Shoot Dates & Locations**
✨ **Attire Guidelines**
✨ **Payment & Packages**
✨ **Pet Policies**

What's on your mind?` 
      }
    ]);
  }
}, []);

  // 2. FIXED AUTO-SCROLL: Now watches 'isOpen' as well
  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    };

    if (isOpen) {
      // Small timeout to wait for the animation/mount to finish
      const timeoutId = setTimeout(scrollToBottom, 100);
      return () => clearTimeout(timeoutId);
    }
    
    // Also scroll when new messages arrive or loading state changes
    scrollToBottom();
  }, [messages, isLoading, isOpen]); // Added 'isOpen' here

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "ai", text: data.text }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "ai", text: "Connection error." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[999] font-sans">
      {/* --- CHAT WINDOW --- */}
      {isOpen && (
        <div className="fixed inset-x-4 bottom-20 md:absolute md:inset-auto md:bottom-20 md:right-0 w-auto md:w-[380px] h-[70vh] md:h-[550px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
            <div className="bg-gradient-to-br from-[#700000] to-[#500000] p-6 text-white flex justify-between items-center shrink-0 shadow-lg relative overflow-hidden">
            {/* Decorative Background - Added pointer-events-none so it doesn't block clicks */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none" />
            
            <div className="relative z-10 flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center font-serif italic text-[#FCC200] font-bold text-xl shadow-inner pointer-events-none">
                A
                </div>
                
                <div>
                <h3 className="font-serif italic text-2xl leading-none tracking-tight">Ask Aninag</h3>
                <div className="flex items-center gap-1.5 mt-1">
                    <span className="relative flex h-2 w-2">
                    {/* Ping effect - Added pointer-events-none */}
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FCC200] opacity-75 pointer-events-none"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FCC200]"></span>
                    </span>
                    <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#FCC200]/90">
                    Chatbot
                    </p>
                </div>
                </div>
            </div>

            {/* FIXED CLOSE BUTTON */}
            <button 
                onClick={(e) => {
                e.stopPropagation(); // Prevents the click from bubbling to the window
                setIsOpen(false);
                }} 
                className="relative z-[100] w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 active:scale-90 transition-all border border-white/10 text-white cursor-pointer"
                aria-label="Close Chat"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            </div>
                        
            {/* Scrollable Area */}
            <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 scroll-smooth"
            >
            {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-[13px] ${
                    m.role === "user" 
                        ? "bg-[#700000] text-white" 
                        : "bg-white text-gray-800 border border-gray-100 shadow-sm"
                    }`}>
                    {m.role === "ai" ? (
                        <div className="prose prose-sm max-w-none 
                        /* THE FIX: Strip vertical margins from paragraphs and lists */
                        prose-p:my-0 
                        prose-ul:my-0 
                        prose-li:my-0 
                        /* Ensure line breaks are respected without adding extra ones */
                        whitespace-pre-line
                        ">
                        <ReactMarkdown>
                            {m.text}
                        </ReactMarkdown>
                        </div>
                    ) : (
                        <div className="whitespace-pre-line">{m.text}</div>
                    )}
                    </div>
                </div>
            ))}
            {isLoading && (
                <div className="text-[10px] text-gray-400 italic animate-pulse pl-1">Assistant is typing...</div>
            )}
            </div>

            <div className="p-4 bg-white border-t border-gray-100 flex gap-2 shrink-0">
            <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask a question..." 
                className="flex-1 bg-gray-100 rounded-2xl px-5 py-3 text-sm focus:ring-1 focus:ring-[#700000] outline-none"
            />
            <button onClick={sendMessage} className="w-12 h-12 bg-[#700000] text-white rounded-2xl flex items-center justify-center">
                →
            </button>
            </div>
        </div>
        )}

      {/* --- FLOATING TOGGLE BUTTON --- */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 md:w-16 md:h-16 bg-[#700000] rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 active:scale-95 transition-all group relative"
      >
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#FCC200] rounded-full border-2 border-white animate-bounce" />
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        )}
      </button>
    </div>
  );
}