import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, MessageSquare, Trash2 } from "lucide-react";

type Conversation = {
  id: string;
  title: string;
};

interface ChatSidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}

const ChatSidebar = ({ conversations, activeId, onSelect, onNew, onDelete }: ChatSidebarProps) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="flex h-full w-[260px] flex-col bg-sidebar border-r border-border">
      {/* New Chat Button */}
      <div className="p-3">
        <button
          onClick={onNew}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-sidebar-hover"
        >
          <Plus className="h-4 w-4" />
          New chat
        </button>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto chat-scrollbar px-2">
        <p className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Recent</p>
        {conversations.map((conv) => (
          <motion.div
            key={conv.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onMouseEnter={() => setHoveredId(conv.id)}
            onMouseLeave={() => setHoveredId(null)}
            className={`group flex items-center gap-2 rounded-lg px-3 py-2.5 cursor-pointer transition-colors text-sm ${
              activeId === conv.id
                ? "bg-sidebar-active text-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-hover"
            }`}
            onClick={() => onSelect(conv.id)}
          >
            <MessageSquare className="h-4 w-4 shrink-0 opacity-60" />
            <span className="truncate flex-1">{conv.title}</span>
            {hoveredId === conv.id && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(conv.id);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3 px-3 py-2 text-xs text-muted-foreground">
          <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-medium">
            G
          </div>
          Gemini Clone
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
