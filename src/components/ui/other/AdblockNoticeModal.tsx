"use client";

import React, { useEffect, useState } from "react";

const STORAGE_KEY = "petrovest_first_visit_ad_notice_v1";

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-md border border-zinc-800 bg-zinc-950 p-6 text-zinc-100 shadow-2xl">
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-amber-400">
          Notice
        </p>
        <h2 id="adblock-notice-title" className="mt-2 text-xl font-semibold tracking-tight">
          Welcome to Petrovest Streaming
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-300">
          Because our content streams from external servers, you may see pop-ups or ads. For the smoothest viewing experience, we recommend using the{" "}
          <span className="font-semibold text-white">Brave browser</span> or an ad blocker like{" "}
          <span className="font-semibold text-white">uBlock Origin</span>.
        </p>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={handleUnderstand}
            className="border border-zinc-100 bg-zinc-100 px-5 py-2.5 text-xs font-mono font-semibold uppercase tracking-wider text-zinc-950 transition-colors hover:bg-zinc-300"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdblockNoticeModal;
