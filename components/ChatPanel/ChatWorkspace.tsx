"use client";

import { useEffect, useRef } from "react";
import { AudioLines } from "lucide-react";
import { ChatMessage } from "@/types";
import { ChatInput } from "@/components/ChatPanel/ChatInput";
import { MessageBubble } from "@/components/ChatPanel/MessageBubble";

interface ChatWorkspaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => Promise<void>;
  onStartVoiceMode: () => void;
}

export function ChatWorkspace({ messages, onSendMessage, onStartVoiceMode }: ChatWorkspaceProps) {
  const messageViewportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const viewport = messageViewportRef.current;
    if (!viewport) {
      return;
    }
    viewport.scrollTop = viewport.scrollHeight;
  }, [messages]);

  return (
    <section className="chat-workspace">
      <header className="chatgpt-header">
        <p>Liam</p>
        <button type="button" className="open-voice-btn" onClick={onStartVoiceMode}>
          <AudioLines size={16} />
          Voice mode
        </button>
      </header>

      <div className="chatgpt-messages" ref={messageViewportRef}>
        {messages.length === 0 ? (
          <div className="chatgpt-empty">
            <h2>How can I help you today?</h2>
          </div>
        ) : (
          messages.map((message) => <MessageBubble key={message.id} message={message} />)
        )}
      </div>

      <div className="chatgpt-input-dock">
        <ChatInput onSend={onSendMessage} hint="" />
      </div>
    </section>
  );
}
