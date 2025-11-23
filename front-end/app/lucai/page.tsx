"use client";

import { useState, useRef, useEffect } from "react";
import { UUID } from "crypto";
import { Send, Bot, User, Loader2 } from "lucide-react";
import VerticalNavBar from "@/components/VerticalNavBar";
import api from "@/services/api";
import LucAINavBar from "@/components/LucAI/LucAINavBar";

interface userData {
  id: UUID;
  name: string;
  lastName: string;
  email: string;
  dateOfBirth: Date;
  age: number;
  profileImageUrl: string;
}

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  isStreaming?: boolean;
  isConnecting?: boolean;
}

export default function LucAI() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [user] = useState<userData | null>(() => {
    if (typeof window === "undefined") return null;
    const userDataString = localStorage.getItem("user");
    if (userDataString) {
      try {
        return JSON.parse(userDataString);
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        return null;
      }
    }
    return null;
  });

  const [messages, setMessages] = useState<Message[]>([]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const streamingTextRef = useRef<string>("");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    const aiMessageId = Date.now() + 1;
    streamingTextRef.current = "";

    const aiMessage: Message = {
      id: aiMessageId,
      text: "",
      sender: "ai",
      timestamp: new Date(),
      isStreaming: false,
      isConnecting: true,
    };

    setMessages((prev) => [...prev, aiMessage]);

    try {
      await api.lucAi(currentInput, (chunk: string) => {
        streamingTextRef.current += chunk;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId
              ? {
                  ...msg,
                  isConnecting: false,
                  isStreaming: true,
                  text: streamingTextRef.current,
                }
              : msg
          )
        );
      });

      const finalResponse = streamingTextRef.current;

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId
            ? {
                ...msg,
                isStreaming: false,
                isConnecting: false,
                text: finalResponse,
              }
            : msg
        )
      );
    } catch (error) {
      console.error(error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId
            ? {
                ...msg,
                text: "Sorry, an error occurred while processing the response.",
                isStreaming: false,
                isConnecting: false,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
      streamingTextRef.current = "";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isMounted) return null;

  return (
    <div className="flex min-h-screen bg-linear-to-br from-slate-900 to-slate-900">
      <VerticalNavBar />
      <div className="flex flex-col w-full max-w-5xl mx-auto p-8">
        <div className="flex flex-col h-[90vh] backdrop-blur-2xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl overflow-visible">
          <header className="flex flex-row justify-between items-center p-6 border-b border-white/20 bg-white/5">
            <LucAINavBar />
          </header>

          <main className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-white/40">
                <Bot className="w-16 h-16 mb-4 opacity-50" />
                <h2 className="text-xl font-medium">
                  How can I help you today{user?.name ? `, ${user.name}` : ""}?
                </h2>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 ${
                      message.sender === "user"
                        ? "flex-row-reverse"
                        : "flex-row"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        message.sender === "ai"
                          ? "bg-linear-to-br from-blue-500 to-red-500"
                          : "bg-black/10 border border-white/20"
                      }`}
                    >
                      {message.sender === "ai" ? (
                        <Bot className="w-5 h-5 text-white" />
                      ) : (
                        <User className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div
                      className={`max-w-[70%] p-4 rounded-2xl min-h-14 ${
                        message.sender === "user"
                          ? "bg-white/10 text-white border border-white/20"
                          : "bg-white/10 backdrop-blur-sm border border-white/20 text-white"
                      }`}
                    >
                      {message.isConnecting ? (
                        <div className="flex items-center gap-2 h-full">
                          <div className="flex gap-1">
                            <span
                              className="w-2 h-2 bg-white/70 rounded-full animate-bounce"
                              style={{ animationDelay: "0ms" }}
                            ></span>
                            <span
                              className="w-2 h-2 bg-white/70 rounded-full animate-bounce"
                              style={{ animationDelay: "150ms" }}
                            ></span>
                            <span
                              className="w-2 h-2 bg-white/70 rounded-full animate-bounce"
                              style={{ animationDelay: "300ms" }}
                            ></span>
                          </div>
                          <span className="text-xs text-white/50">
                            thinking...
                          </span>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {message.text}
                            {message.isStreaming && (
                              <span className="inline-block w-2 h-4 ml-1 bg-white/70 animate-pulse align-middle" />
                            )}
                          </p>
                          {!message.isStreaming && !message.isConnecting && (
                            <p className="text-xs flex justify-end mt-4 text-white/50">
                              {new Date(message.timestamp).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </main>

          <div className="p-6 border-t border-white/20 bg-white/5">
            <div className="flex gap-3 items-end">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask anything..."
                rows={1}
                disabled={isLoading}
                className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-white/10 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="w-12 h-12 rounded-xl bg-linear-to-br from-red-500 to-red-500 flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                ) : (
                  <Send className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
