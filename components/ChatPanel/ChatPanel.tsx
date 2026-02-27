"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { ChatMessage } from "@/types";
import { ChatInput } from "@/components/ChatPanel/ChatInput";
import { MessageBubble } from "@/components/ChatPanel/MessageBubble";

interface ChatPanelProps {
  open: boolean;
  messages: ChatMessage[];
  onClose: () => void;
  onSendMessage: (message: string) => Promise<void>;
}

export function ChatPanel({ open, messages, onClose, onSendMessage }: ChatPanelProps) {
  const messageViewportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const viewport = messageViewportRef.current;
    if (!viewport) {
      return;
    }
    viewport.scrollTop = viewport.scrollHeight;
  }, [messages]);

  return (
    <aside className={`chat-panel ${open ? "open" : ""}`} aria-hidden={!open}>
      <div className="chat-header">
        <div>
          <p className="chat-title">Conversation</p>
          <p className="chat-subtitle">Liam AI Voice Agent</p>
        </div>
        <button type="button" className="panel-close" onClick={onClose} aria-label="Close chat panel">
          <X size={18} />
        </button>
      </div>

      <div className="message-list" ref={messageViewportRef}>
        {messages.length === 0 ? <p className="empty-chat">Say hello to Liam to begin.</p> : null}
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>

      <ChatInput onSend={onSendMessage} />
    </aside>
  );
}
