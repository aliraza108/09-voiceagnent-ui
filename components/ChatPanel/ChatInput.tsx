"use client";

import { FormEvent, useState } from "react";
import { SendHorizontal } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => Promise<void>;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [value, setValue] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!value.trim()) {
      return;
    }
    const next = value;
    setValue("");
    await onSend(next);
  };

  return (
    <form className="chat-input-wrap" onSubmit={handleSubmit}>
      <div className="chat-input-shell">
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Type a message..."
          className="chat-input"
          disabled={disabled}
        />
        <button className="send-btn" type="submit" disabled={disabled || !value.trim()} aria-label="Send message">
          <SendHorizontal size={18} />
        </button>
      </div>
      <p className="chat-input-hint">or hold mic button to speak</p>
    </form>
  );
}
