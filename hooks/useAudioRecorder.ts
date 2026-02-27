"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseAudioRecorderOptions {
  onStop?: (audioBlob: Blob) => void;
}

export function useAudioRecorder(options: UseAudioRecorderOptions = {}) {
  const { onStop } = options;
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [durationSec, setDurationSec] = useState(0);

  const cleanupStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const start = useCallback(async () => {
    if (isRecording) {
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;

    const preferredMime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
      ? "audio/webm;codecs=opus"
      : "audio/webm";
    const mediaRecorder = new MediaRecorder(stream, { mimeType: preferredMime });
    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mediaRecorder.mimeType || "audio/webm" });
      chunksRef.current = [];
      cleanupStream();
      onStop?.(blob);
    };

    mediaRecorder.start();
    setDurationSec(0);
    setIsRecording(true);
    timerRef.current = window.setInterval(() => {
      setDurationSec((prev) => prev + 1);
    }, 1000);
  }, [cleanupStream, isRecording, onStop]);

  const stop = useCallback(() => {
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state === "inactive") {
      return;
    }
    mediaRecorderRef.current.stop();
    setIsRecording(false);
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      cleanupStream();
    };
  }, [cleanupStream]);

  return {
    isRecording,
    durationSec,
    start,
    stop
  };
}
