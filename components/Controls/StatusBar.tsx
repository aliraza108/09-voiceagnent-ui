import { AgentStatus } from "@/types";
import { LoadingDots } from "@/components/UI/LoadingDots";

interface StatusBarProps {
  status: AgentStatus;
  label: string;
}

export function StatusBar({ status, label }: StatusBarProps) {
  return (
    <div className={`status-bar status-${status}`}>
      <span>{label}</span>
      {(status === "listening" || status === "thinking") && <LoadingDots />}
    </div>
  );
}
