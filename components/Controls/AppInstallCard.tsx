"use client";

import { Download, CheckCircle2 } from "lucide-react";
import { usePwaInstall } from "@/hooks/usePwaInstall";

export function AppInstallCard() {
  const { isInstallable, isInstalled, install } = usePwaInstall();

  return (
    <section className="install-card">
      <div>
        <p className="install-title">Mobile App</p>
        <p className="install-subtitle">
          {isInstalled
            ? "Liam is already installed on this device."
            : "Install this web app directly from your browser settings."}
        </p>
      </div>
      {isInstalled ? (
        <span className="install-installed">
          <CheckCircle2 size={14} />
          Installed
        </span>
      ) : isInstallable ? (
        <button type="button" className="install-btn" onClick={() => void install()}>
          <Download size={14} />
          Install Liam
        </button>
      ) : (
        <p className="install-hint">Use browser menu and tap Add to Home Screen.</p>
      )}
    </section>
  );
}
