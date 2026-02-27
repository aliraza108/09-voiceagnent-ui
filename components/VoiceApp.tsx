"use client";

import { MessageSquare, AlertCircle } from "lucide-react";
import { ChatPanel } from "@/components/ChatPanel/ChatPanel";
import { MicButton } from "@/components/Controls/MicButton";
import { SessionControls } from "@/components/Controls/SessionControls";
import { StatusBar } from "@/components/Controls/StatusBar";
import { MobileAppBanner } from "@/components/MobileAppBanner/MobileAppBanner";
import { GlowCard } from "@/components/UI/GlowCard";
import { VoiceOrb } from "@/components/VoiceOrb/VoiceOrb";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { useVoiceSession } from "@/hooks/useVoiceSession";

export function VoiceApp() {
  const {
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
    wsConnected,
    sendText,
    sendVoice,
    clearConversation,
    resetSession,
    startListeningState,
    stopListeningState,
    forceIdle
  } = useVoiceSession();

  const recorder = useAudioRecorder({
    onStop: (audioBlob) => {
      stopListeningState();
      void sendVoice(audioBlob);
    }
  });

  const startRecording = async () => {
    startListeningState();
    try {
      await recorder.start();
    } catch {
      forceIdle();
    }
  };

  const stopRecording = () => {
    recorder.stop();
  };

  return (
    <main className="voice-app-shell">
      <MobileAppBanner />

      <section className="hero-section">
        <p className="hero-kicker">LIAM</p>
        <h1>AI Voice Agent</h1>
        <p className="hero-subtitle">Real-time conversations powered by advanced voice intelligence.</p>
      </section>

      <GlowCard className="orb-stage">
        <VoiceOrb state={orbState} />
        <StatusBar status={status} label={statusLabel} />
        {error ? (
          <p className="error-text">
            <AlertCircle size={14} />
            {error}
          </p>
        ) : null}

        <div className="primary-controls">
          <MicButton
            recording={recorder.isRecording}
            mode={micMode}
            durationSec={recorder.durationSec}
            onStart={startRecording}
            onStop={stopRecording}
            onModeChange={setMicMode}
          />
          <button type="button" className="chat-toggle-btn" onClick={() => setChatOpen((prev) => !prev)}>
            <MessageSquare size={18} />
            Chat
          </button>
        </div>
      </GlowCard>

      <SessionControls
        sessionId={sessionId}
        wsConnected={wsConnected}
        onNewSession={resetSession}
        onClear={clearConversation}
      />

      <ChatPanel open={chatOpen} messages={messages} onClose={() => setChatOpen(false)} onSendMessage={sendText} />
    </main>
  );
}
