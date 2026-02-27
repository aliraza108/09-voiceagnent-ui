import {
  ChatResponse,
  HealthResponse,
  SessionResponse,
  SttResponse,
  TtsResponse,
  VoiceTalkResponse
} from "@/types";

const API_BASE_URL = "https://09-voiceagent-api.vercel.app";

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`API ${response.status}: ${body || response.statusText}`);
  }
  return (await response.json()) as T;
}

export async function newSession(): Promise<SessionResponse> {
  const response = await fetch(`${API_BASE_URL}/chat/session/new`, {
    method: "POST",
    headers: { "Content-Type": "application/json" }
  });
  return parseResponse<SessionResponse>(response);
}

export async function sendTextMessage(message: string, sessionId: string): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE_URL}/chat/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, session_id: sessionId })
  });
  return parseResponse<ChatResponse>(response);
}

export async function generateTts(text: string): Promise<TtsResponse> {
  const response = await fetch(`${API_BASE_URL}/tts/generate/json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });
  return parseResponse<TtsResponse>(response);
}

export async function transcribeAudio(audio: Blob): Promise<SttResponse> {
  const formData = new FormData();
  formData.append("audio", audio, "audio.webm");

  const response = await fetch(`${API_BASE_URL}/stt/transcribe`, {
    method: "POST",
    body: formData
  });
  return parseResponse<SttResponse>(response);
}

export async function voiceTalk(audio: Blob, sessionId: string): Promise<VoiceTalkResponse> {
  const formData = new FormData();
  formData.append("audio", audio, "audio.webm");
  formData.append("session_id", sessionId);

  const response = await fetch(`${API_BASE_URL}/voice/talk/json`, {
    method: "POST",
    body: formData
  });
  return parseResponse<VoiceTalkResponse>(response);
}

export async function checkHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE_URL}/health`, { method: "GET" });
  return parseResponse<HealthResponse>(response);
}

export function createVoiceWsUrl(sessionId: string): string {
  return `wss://09-voiceagent-api.vercel.app/ws/voice?session_id=${encodeURIComponent(sessionId)}`;
}
