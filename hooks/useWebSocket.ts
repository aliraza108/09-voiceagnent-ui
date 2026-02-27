"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createVoiceWsUrl } from "@/lib/api";
import { VoiceWsJsonMessage } from "@/types";

interface UseWebSocketOptions {
  enabled: boolean;
  sessionId?: string;
  onJsonMessage?: (message: VoiceWsJsonMessage) => void;
  onBinaryMessage?: (audioChunk: ArrayBuffer) => void;
}

export function useWebSocket(options: UseWebSocketOptions) {
  const { enabled, sessionId, onJsonMessage, onBinaryMessage } = options;
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.onopen = null;
      wsRef.current.onclose = null;
      wsRef.current.onmessage = null;
      wsRef.current.onerror = null;
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const connect = useCallback(() => {
    if (!enabled || !sessionId || wsRef.current) {
      return;
    }

    const ws = new WebSocket(createVoiceWsUrl(sessionId));
    ws.binaryType = "arraybuffer";

    ws.onopen = () => setIsConnected(true);
    ws.onclose = () => {
      setIsConnected(false);
      wsRef.current = null;
    };
    ws.onerror = () => setIsConnected(false);
    ws.onmessage = (event) => {
      if (typeof event.data === "string") {
        try {
          const parsed = JSON.parse(event.data) as VoiceWsJsonMessage;
          onJsonMessage?.(parsed);
        } catch {
          // Ignore non-protocol payloads.
        }
        return;
      }

      if (event.data instanceof ArrayBuffer) {
        onBinaryMessage?.(event.data);
      } else if (event.data instanceof Blob) {
        void event.data.arrayBuffer().then((buffer) => onBinaryMessage?.(buffer));
      }
    };

    wsRef.current = ws;
  }, [enabled, onBinaryMessage, onJsonMessage, sessionId]);

  const sendBinary = useCallback((payload: ArrayBuffer) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket is not connected.");
    }
    wsRef.current.send(payload);
  }, []);

  useEffect(() => {
    connect();
    return disconnect;
  }, [connect, disconnect]);

  return {
    isConnected,
    sendBinary,
    reconnect: () => {
      disconnect();
      connect();
    }
  };
}
