"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { newSession, sendTextMessage, voiceTalk } from "@/lib/api";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useWebSocket } from "@/hooks/useWebSocket";
import { AgentStatus, ChatMessage, OrbState, VoiceWsJsonMessage } from "@/types";

type MicMode = "hold" | "toggle";
type TransportMode = "rest" | "ws";

function createMessage(role: "user" | "assistant", text: string, transcript?: string): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role,
    text,
    transcript,
    createdAt: new Date().toISOString()
  };
}

export function useVoiceSession() {
  const [sessionId, setSessionId] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [orbState, setOrbState] = useState<OrbState>("idle");
  const [status, setStatus] = useState<AgentStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [micMode, setMicMode] = useState<MicMode>("hold");
  const [transportMode] = useState<TransportMode>("rest");
  const [pendingTranscript, setPendingTranscript] = useState<string>("");
  const [pendingReply, setPendingReply] = useState<string>("");

  const { enqueueBase64, isPlaying, stop: stopAudio } = useAudioPlayer();

  const pushMessage = useCallback((role: "user" | "assistant", text: string, transcript?: string) => {
    setMessages((prev) => [...prev, createMessage(role, text, transcript)]);
  }, []);

  const resetSession = useCallback(async () => {
    setError(null);
    setMessages([]);
    setPendingTranscript("");
    setPendingReply("");
    setOrbState("idle");
    setStatus("idle");
    stopAudio();
    const nextSession = await newSession();
    setSessionId(nextSession.session_id);
  }, [stopAudio]);

  useEffect(() => {
    void resetSession().catch((err: unknown) => {
      const message = err instanceof Error ? err.message : "Unable to create session.";
      setError(message);
      setOrbState("error");
      setStatus("error");
    });
  }, [resetSession]);

  useEffect(() => {
    if (isPlaying) {
      setOrbState("speaking");
      setStatus("speaking");
      return;
    }
    if (status !== "error" && status !== "listening" && status !== "thinking") {
      setOrbState("idle");
      setStatus("idle");
    }
  }, [isPlaying, status]);

  const handleWsJson = useCallback(
    (message: VoiceWsJsonMessage) => {
      if (message.type === "transcript") {
        setPendingTranscript(message.text);
      }
      if (message.type === "reply_text") {
        setPendingReply(message.text);
      }
      if (message.type === "done") {
        if (pendingTranscript.trim()) {
          pushMessage("user", pendingTranscript.trim());
        }
        if (pendingReply.trim()) {
          pushMessage("assistant", pendingReply.trim(), pendingTranscript.trim() || undefined);
        }
        setPendingTranscript("");
        setPendingReply("");
        setStatus("idle");
        setOrbState("idle");
      }
    },
    [pendingReply, pendingTranscript, pushMessage]
  );

  const handleWsBinary = useCallback(
    (chunk: ArrayBuffer) => {
      const blob = new Blob([chunk], { type: "audio/mpeg" });
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result === "string") {
          enqueueBase64(result.split(",")[1] ?? result);
        }
      };
      reader.readAsDataURL(blob);
    },
    [enqueueBase64]
  );

  const ws = useWebSocket({
    enabled: transportMode === "ws" && Boolean(sessionId),
    sessionId,
    onJsonMessage: handleWsJson,
    onBinaryMessage: handleWsBinary
  });

  const sendText = useCallback(
    async (text: string) => {
      if (!text.trim() || !sessionId) {
        return;
      }
      setError(null);
      pushMessage("user", text.trim());
      setStatus("thinking");
      setOrbState("thinking");
      try {
        const data = await sendTextMessage(text.trim(), sessionId);
        pushMessage("assistant", data.reply);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to send message.";
        setError(message);
        setStatus("error");
        setOrbState("error");
      } finally {
        if (!isPlaying) {
          setStatus("idle");
          setOrbState("idle");
        }
      }
    },
    [isPlaying, pushMessage, sessionId]
  );

  const sendVoice = useCallback(
    async (audioBlob: Blob) => {
      if (!sessionId) {
        return;
      }
      setError(null);
      setStatus("thinking");
      setOrbState("thinking");

      try {
        if (transportMode === "ws" && ws.isConnected) {
          const buffer = await audioBlob.arrayBuffer();
          ws.sendBinary(buffer);
          return;
        }

        const response = await voiceTalk(audioBlob, sessionId);
        if (response.transcript?.trim()) {
          pushMessage("user", response.transcript.trim());
        }
        if (response.reply_text?.trim()) {
          pushMessage("assistant", response.reply_text.trim(), response.transcript?.trim());
        }
        if (response.audio_base64) {
          enqueueBase64(response.audio_base64);
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to process audio.";
        setError(message);
        setStatus("error");
        setOrbState("error");
      } finally {
        if (!isPlaying) {
          setStatus("idle");
          setOrbState("idle");
        }
      }
    },
    [enqueueBase64, isPlaying, pushMessage, sessionId, transportMode, ws]
  );

  const clearConversation = useCallback(() => {
    setMessages([]);
    setError(null);
    setPendingReply("");
    setPendingTranscript("");
  }, []);

  const statusLabel = useMemo(() => {
    if (status === "listening") {
      return "Listening... 🎤";
    }
    if (status === "thinking") {
      return "Liam is thinking...";
    }
    if (status === "speaking") {
      return "Liam is speaking...";
    }
    if (status === "error") {
      return "Connection error. Retry?";
    }
    return "Ready to listen...";
  }, [status]);

  const startListeningState = useCallback(() => {
    setError(null);
    setStatus("listening");
    setOrbState("listening");
  }, []);

  const stopListeningState = useCallback(() => {
    setStatus("thinking");
    setOrbState("thinking");
  }, []);

  const forceIdle = useCallback(() => {
    if (!isPlaying) {
      setStatus("idle");
      setOrbState("idle");
    }
  }, [isPlaying]);

  return {
    sessionId,
    messages,
    chatOpen,
    setChatOpen,
    orbState,
    status,
    statusLabel,
    error,
    micMode,
    setMicMode,
    transportMode,
    wsConnected: ws.isConnected,
    sendText,
    sendVoice,
    clearConversation,
    resetSession,
    startListeningState,
    stopListeningState,
    forceIdle
  };
}
