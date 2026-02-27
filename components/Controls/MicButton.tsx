"use client";

import { Mic, MicOff } from "lucide-react";

interface MicButtonProps {
  recording: boolean;
  mode: "hold" | "toggle";
  durationSec: number;
  onStart: () => Promise<void> | void;
  onStop: () => void;
  onModeChange: (mode: "hold" | "toggle") => void;
}

function formatDuration(seconds: number): string {
  const mm = Math.floor(seconds / 60);
  const ss = seconds % 60;
  return `${mm}:${String(ss).padStart(2, "0")}`;
}

export function MicButton({
  recording,
  mode,
  durationSec,
  onStart,
  onStop,
  onModeChange
}: MicButtonProps) {
  const handleClick = async () => {
    if (mode !== "toggle") {
      return;
    }
    if (recording) {
      onStop();
      return;
    }
    await onStart();
  };

  return (
    <div className="mic-controls-wrap">
      <div className="mic-mode-toggle" role="group" aria-label="Mic mode">
        <button
          type="button"
          className={mode === "hold" ? "active" : ""}
          onClick={() => onModeChange("hold")}
        >
          Hold
        </button>
        <button
          type="button"
          className={mode === "toggle" ? "active" : ""}
          onClick={() => onModeChange("toggle")}
        >
          Toggle
        </button>
      </div>

      <button
        type="button"
        className={`mic-btn ${recording ? "recording" : ""}`}
        onClick={handleClick}
        onMouseDown={mode === "hold" ? () => void onStart() : undefined}
        onMouseUp={mode === "hold" ? onStop : undefined}
        onMouseLeave={mode === "hold" && recording ? onStop : undefined}
        onTouchStart={mode === "hold" ? () => void onStart() : undefined}
        onTouchEnd={mode === "hold" ? onStop : undefined}
      >
        <span className="mic-btn-icon">{recording ? <MicOff size={20} /> : <Mic size={20} />}</span>
        <span>{recording ? "Release to Send" : mode === "hold" ? "Hold to Talk" : "Tap to Talk"}</span>
        {recording ? <span className="mic-timer">{formatDuration(durationSec)}</span> : null}
      </button>
    </div>
  );
}
