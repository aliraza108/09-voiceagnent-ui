"use client";

import { useState } from "react";
import { Smartphone, X } from "lucide-react";

export function MobileAppBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return null;
  }

  return (
    <div className="mobile-app-banner">
      <div className="banner-content">
        <p>
          <Smartphone size={14} />
          <span>Download the Liam AI App</span>
        </p>
        <div className="banner-actions">
          <button type="button">App Store</button>
          <button type="button">Google Play</button>
        </div>
      </div>
      <button className="banner-close" type="button" onClick={() => setDismissed(true)} aria-label="Dismiss banner">
        <X size={14} />
      </button>
    </div>
  );
}
