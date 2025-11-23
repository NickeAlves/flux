import { useState, useEffect } from "react";
import { Bot, User, Loader2, ChevronRight, ArrowLeft } from "lucide-react";
import Modal from "@/components/Modal";
import api from "@/services/api";

interface ConversationItem {
  userMessage: string;
  aiResponse: string;
  timestamp: string;
}

interface LucaiConversation {
  id: string;
  userId: string;
  conversationHistory: ConversationItem[];
  longTermContext: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  lucai: LucaiConversation;
  timestamp: string;
}

function groupMessagesByDay(messages: ConversationItem[]) {
  const groups: Record<string, ConversationItem[]> = {};
  messages.forEach((msg) => {
    const date = new Date(msg.timestamp);
    const dayKey = date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    if (!groups[dayKey]) groups[dayKey] = [];
    groups[dayKey].push(msg);
  });
  return groups;
}

export default function ConversationHistoryModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [conversation, setConversation] = useState<LucaiConversation | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchConversations = async () => {
      setLoading(true);
      try {
        const data: ApiResponse = await api.getConversationByUserId();
        setConversation(data.lucai);
      } catch (err) {
        console.error("Erro ao carregar conversas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [isOpen]);

  if (loading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Conversas antigas">
        <div className="flex justify-center items-center py-10">
          <Loader2 className="w-6 h-6 text-white animate-spin" />
        </div>
      </Modal>
    );
  }

  if (!conversation) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Conversas antigas">
        <p className="text-white/70 text-center">
          Nenhuma conversa encontrada.
        </p>
      </Modal>
    );
  }

  const groupedMessages = groupMessagesByDay(conversation.conversationHistory);
  const sortedDays = Object.keys(groupedMessages).sort(
    (a, b) =>
      new Date(b.split("/").reverse().join("-")).getTime() -
      new Date(a.split("/").reverse().join("-")).getTime()
  );

  const selectedMessages = selectedDate
    ? groupedMessages[selectedDate] || []
    : [];

  const scrollStyle =
    "scrollbar-thin scrollbar-thumb-black/70 scrollbar-track-transparent scrollbar-thumb-rounded-full";

  if (!selectedDate) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Conversas antigas">
        {sortedDays.length === 0 ? (
          <p className="text-white/70 text-center">
            Nenhuma conversa encontrada.
          </p>
        ) : (
          <div className={`max-h-[70vh] overflow-y-auto pr-2 ${scrollStyle}`}>
            {sortedDays.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDate(day)}
                className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 transition-colors border border-white/10 rounded-xl p-4 text-left"
              >
                <div>
                  <p className="text-white font-medium">{day}</p>
                  <p className="text-white/50 text-sm">
                    {groupedMessages[day].length} mensagens
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-white/50" />
              </button>
            ))}
          </div>
        )}
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (selectedDate) setSelectedDate(null);
        else onClose();
      }}
      title={`Conversa de ${selectedDate}`}
    >
      <div
        className={`space-y-6 max-h-[70vh] overflow-y-auto pr-2 ${scrollStyle}`}
      >
        <button
          onClick={() => setSelectedDate(null)}
          className="flex items-center gap-2 text-white/70 hover:text-white text-sm mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para lista de dias
        </button>

        {selectedMessages.map((msg, i) => (
          <div
            key={i}
            className="space-y-2 bg-white/5 rounded-xl border border-white/10 p-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-cyan-500 flex justify-center items-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <p className="text-white text-sm bg-white/10 p-3 rounded-lg">
                {msg.userMessage}
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-red-500 to-red-500 flex justify-center items-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <p className="text-white text-sm bg-white/10 p-3 rounded-lg whitespace-pre-line">
                {msg.aiResponse}
              </p>
            </div>

            <p className="text-xs text-white/40 text-right">
              {new Date(msg.timestamp).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        ))}
      </div>
    </Modal>
  );
}
