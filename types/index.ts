export type OrbState = "idle" | "listening" | "thinking" | "speaking" | "error";

export type AgentStatus = "idle" | "listening" | "thinking" | "speaking" | "error";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  transcript?: string;
  createdAt: string;
}

export interface SessionResponse {
  session_id: string;
}

export interface ChatRequest {
  message: string;
  session_id: string;
}

export interface ChatResponse {
  reply: string;
  session_id: string;
}

export interface TtsRequest {
  text: string;
}

export interface TtsResponse {
  audio_base64: string;
  audio_format: string;
}

export interface SttResponse {
  transcript: string;
}

export interface VoiceTalkResponse {
  transcript: string;
  reply_text: string;
  audio_base64: string;
  session_id: string;
}

export interface HealthResponse {
  status: string;
}

export interface WsConnectedEvent {
  type: "connected";
  session_id: string;
}

export interface WsTranscriptEvent {
  type: "transcript";
  text: string;
}

export interface WsReplyTextEvent {
  type: "reply_text";
  text: string;
}

export interface WsDoneEvent {
  type: "done";
}

export type VoiceWsJsonMessage =
  | WsConnectedEvent
  | WsTranscriptEvent
  | WsReplyTextEvent
  | WsDoneEvent;
