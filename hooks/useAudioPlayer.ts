"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { base64ToBlob } from "@/lib/audioUtils";

export function useAudioPlayer() {
  const queueRef = useRef<string[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playNext = useCallback(() => {
    const next = queueRef.current.shift();
    if (!next) {
      setIsPlaying(false);
      return;
    }

    const blob = base64ToBlob(next, "audio/mpeg");
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audioRef.current = audio;
    setIsPlaying(true);

    audio.onended = () => {
      URL.revokeObjectURL(url);
      audioRef.current = null;
      playNext();
    };
    audio.onerror = () => {
      URL.revokeObjectURL(url);
      audioRef.current = null;
      playNext();
    };
    void audio.play();
  }, []);

  const enqueueBase64 = useCallback(
    (audioBase64: string) => {
      queueRef.current.push(audioBase64);
      if (!audioRef.current) {
        playNext();
      }
    },
    [playNext]
  );

  const stop = useCallback(() => {
    queueRef.current = [];
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  useEffect(() => stop, [stop]);

  return {
    enqueueBase64,
    stop,
    isPlaying
  };
}
