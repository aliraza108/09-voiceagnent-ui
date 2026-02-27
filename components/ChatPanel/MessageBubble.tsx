import { ChatMessage } from "@/types";

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  return (
    <div className={`message-row ${isUser ? "message-user" : "message-assistant"}`}>
      <div className={`message-bubble ${isUser ? "user-bubble" : "assistant-bubble"}`}>
        <p>{message.text}</p>
        {!isUser && message.transcript ? (
          <p className="transcript-note">Transcript: {message.transcript}</p>
        ) : null}
      </div>
    </div>
  );
}
