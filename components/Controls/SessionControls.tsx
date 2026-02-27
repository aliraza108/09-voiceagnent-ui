import { RefreshCw, Trash2 } from "lucide-react";

interface SessionControlsProps {
  sessionId: string;
  wsConnected: boolean;
  onNewSession: () => Promise<void>;
  onClear: () => void;
}

export function SessionControls({ sessionId, wsConnected, onNewSession, onClear }: SessionControlsProps) {
  return (
    <div className="session-controls">
      <p className="session-meta">
        Session: <span>{sessionId ? sessionId.slice(0, 8) : "..."}</span>
        <span className={`session-dot ${wsConnected ? "online" : "offline"}`}>
          {wsConnected ? "WS Connected" : "REST Mode"}
        </span>
      </p>
      <div className="session-actions">
        <button type="button" onClick={() => void onNewSession()}>
          <RefreshCw size={16} />
          New session
        </button>
        <button type="button" onClick={onClear}>
          <Trash2 size={16} />
          Clear chat
        </button>
      </div>
    </div>
  );
}
