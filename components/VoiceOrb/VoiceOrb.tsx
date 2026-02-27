import { OrbState } from "@/types";
import "./OrbAnimations.css";

interface VoiceOrbProps {
  state: OrbState;
}

export function VoiceOrb({ state }: VoiceOrbProps) {
  return (
    <div className={`orb-container orb-${state}`}>
      <div className="orb-glow-ring" />

      <div className="orb-ripple ripple-1" />
      <div className="orb-ripple ripple-2" />
      <div className="orb-ripple ripple-3" />

      <div className="orb-body">
        <div className="orb-inner-gradient" />
        <div className="orb-wave-bars">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className={`wave-bar bar-${i}`} />
          ))}
        </div>
        <div className="thinking-dots">
          <span />
          <span />
          <span />
        </div>
      </div>

      <div className="orbit-particle p1" />
      <div className="orbit-particle p2" />
      <div className="orbit-particle p3" />
    </div>
  );
}
