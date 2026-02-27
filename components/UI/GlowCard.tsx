import { ReactNode } from "react";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
}

export function GlowCard({ children, className = "" }: GlowCardProps) {
  return <div className={`glow-card ${className}`.trim()}>{children}</div>;
}
