"use client";

import { useState, useRef, useEffect } from "react";
import { UUID } from "crypto";
import { Send, Bot, User, Loader2 } from "lucide-react";
import VerticalNavBar from "@/components/VerticalNavBar";
import api from "@/services/api";
import LucAINavBar from "@/components/LucAINavBar";

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
  const [user] = useState<userData | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const userDataString = localStorage.getItem("user");
    if (userDataString) {
      try {
        return JSON.parse(userDataString);
      } catch (error) {
        console.error("Error parsing user data:", error);
        return null;
      }
    }
    return null;
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const userName = user?.name || "usuário";

    const welcomeMessages = [
      `Bem-vindo de volta, ${userName}! É ótimo ver você por aqui novamente.`,
      `Olá, ${userName}! Pronto para cuidar das suas finanças hoje?`,
      `Oi, ${userName}! Vamos revisar suas despesas e planejar seus próximos passos?`,
    ];

    const initialMessage =
      welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];

    return [
      {
        id: 1,
        text: initialMessage,
        sender: "ai",
        timestamp: new Date(),
      },
    ];
  });

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      let firstChunkReceived = false;

      await api.lucAi(currentInput, (chunk: string) => {
        if (!firstChunkReceived) {
          firstChunkReceived = true;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId
                ? {
                    ...msg,
                    isConnecting: false,
                    isStreaming: true,
                    text: chunk,
                  }
                : msg
            )
          );
        } else {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId ? { ...msg, text: msg.text + chunk } : msg
            )
          );
        }
      });

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId
            ? { ...msg, isStreaming: false, isConnecting: false }
            : msg
        )
      );
    } catch (error) {
      console.error("Error generating response:", error);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId
            ? {
                ...msg,
                text: "Sorry, an error ocurred while processing the response.",
                isStreaming: false,
                isConnecting: false,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
      <VerticalNavBar />
      <div className="flex flex-col w-full max-w-5xl mx-auto p-8">
        <div className="flex flex-col h-[90vh] backdrop-blur-2xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl overflow-visible">
          <header className="flex flex-row justify-between items-center p-6 border-b border-white/20 bg-white/5">
            <LucAINavBar />
          </header>

          <main className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.sender === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    message.sender === "ai"
                      ? "bg-linear-to-br from-purple-500 to-pink-500"
                      : "bg-linear-to-br from-blue-500 to-cyan-500"
                  }`}
                >
                  {message.sender === "ai" ? (
                    <Bot className="w-5 h-5 text-white" />
                  ) : (
                    <User className="w-5 h-5 text-white" />
                  )}
                </div>
                <div
                  className={`max-w-[70%] p-4 rounded-2xl ${
                    message.sender === "user"
                      ? "bg-linear-to-br from-blue-500 to-cyan-500 text-white"
                      : "bg-white/10 backdrop-blur-sm border border-white/20 text-white"
                  }`}
                >
                  {message.isConnecting ? (
                    <div className="flex items-center gap-2">
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
                      <span className="text-xs text-white/50">thinking...</span>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.text}
                        {message.isStreaming && (
                          <span className="inline-block w-2 h-4 ml-1 bg-white/70 animate-pulse" />
                        )}
                      </p>
                      {!message.isStreaming && !message.isConnecting && (
                        <p className="text-xs flex justify-end mt-4 text-white/50">
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}

            <div ref={messagesEndRef} />
          </main>

          <div className="p-6 border-t border-white/20 bg-white/5">
            <div className="flex gap-3 items-end">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask..."
                rows={1}
                disabled={isLoading}
                className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="w-12 h-12 rounded-xl bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
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
