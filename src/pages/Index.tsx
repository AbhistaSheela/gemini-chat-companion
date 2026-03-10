import { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "sonner";
import ChatSidebar from "@/components/ChatSidebar";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import WelcomeScreen from "@/components/WelcomeScreen";
import TypingIndicator from "@/components/TypingIndicator";
import { sendMessage, type Message } from "@/lib/chat";
import { Menu, X } from "lucide-react";

type Conversation = {
  id: string;
  title: string;
  messages: Message[];
};

const Index = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find((c) => c.id === activeId);
  const messages = activeConv?.messages || [];

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  const createConversation = (firstMessage?: string): string => {
    const id = crypto.randomUUID();
    const title = firstMessage
      ? firstMessage.slice(0, 40) + (firstMessage.length > 40 ? "..." : "")
      : "New chat";
    setConversations((prev) => [{ id, title, messages: [] }, ...prev]);
    setActiveId(id);
    return id;
  };

  const handleSend = async (input: string) => {
    let convId = activeId;
    if (!convId) {
      convId = createConversation(input);
    }

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? {
              ...c,
              title: c.messages.length === 0 ? input.slice(0, 40) + (input.length > 40 ? "..." : "") : c.title,
              messages: [...c.messages, userMsg],
            }
          : c
      )
    );

    setIsLoading(true);

    try {
      const history = [
        ...(conversations.find((c) => c.id === convId)?.messages || []).map((m) => ({
          role: m.role,
          content: m.content,
        })),
        { role: "user" as const, content: input },
      ];

      const reply = await sendMessage(history);

      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: reply,
        timestamp: new Date(),
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId ? { ...c, messages: [...c.messages, assistantMsg] } : c
        )
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to get response");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setActiveId(null);
  };

  const handleDeleteConv = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeId === id) setActiveId(null);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-3 left-3 z-50 flex h-9 w-9 items-center justify-center rounded-lg bg-card border border-border text-foreground md:hidden"
      >
        {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-200 md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <ChatSidebar
          conversations={conversations}
          activeId={activeId}
          onSelect={(id) => {
            setActiveId(id);
            setSidebarOpen(false);
          }}
          onNew={handleNewChat}
          onDelete={handleDeleteConv}
        />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/60 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {messages.length === 0 && !activeId ? (
          <>
            <WelcomeScreen onSuggestion={handleSend} />
            <ChatInput onSend={handleSend} isLoading={isLoading} />
          </>
        ) : (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto chat-scrollbar">
              <div className="mx-auto max-w-3xl">
                {messages.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} />
                ))}
                {isLoading && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <ChatInput onSend={handleSend} isLoading={isLoading} />
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
