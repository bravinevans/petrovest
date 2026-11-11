"use client";

import React, { useEffect, useState } from "react";

const STORAGE_KEY = "petrovest_ad_notice_dismissed";

export const AdblockNoticeModal: React.FC = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const seen = localStorage.getItem(STORAGE_KEY);
      if (!seen) {
        setOpen(true);
      }
    } catch {
      setOpen(true);
    }
  }, []);

  const handleUnderstand = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // Ignore storage restrictions
    }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="adblock-notice-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4"
    >
      <div className="w-full max-w-md rounded-xl border border-divider bg-content1 p-6 text-foreground shadow-xl">
        <h2 id="adblock-notice-title" className="text-lg font-semibold">
          Viewing Notice
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-default-500">
          Because our content streams from external servers, you may see pop-ups or ads. For the smoothest viewing experience, we recommend using the{" "}
          <span className="font-medium text-foreground">Brave browser</span> or an ad blocker like{" "}
          <span className="font-medium text-foreground">uBlock Origin</span>.
        </p>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={handleUnderstand}
            className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdblockNoticeModal;
