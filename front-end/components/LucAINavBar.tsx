"use client";

import { useState } from "react";
import { MessagesSquare, Bot } from "lucide-react";
import ConversationHistoryModal from "@/components/ConversationHistoryModal";

export default function LucAINavBar() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="w-full relative z-50">
        <nav className="flex flex-row justify-between items-center p-1">
          <div className="flex flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <p className="text-xl font-semibold text-white">LucAI</p>
          </div>

          <div className="flex flex-row gap-2">
            <div className="group relative">
              <button
                onClick={() => setShowModal(true)}
                className="p-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
              >
                <MessagesSquare size={20} />
              </button>

              <div className="absolute left-full ml-3 px-3 py-1.5 bg-gray-800/95 backdrop-blur-sm text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap shadow-lg border border-white/10 pointer-events-none z-50">
                Chats
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-800/95"></div>
              </div>
            </div>
          </div>
        </nav>
      </div>

      <ConversationHistoryModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}
