"use client";

import React, { useEffect, useState } from "react";

const STORAGE_KEY = "petrovest_adblock_notice_seen";

export const AdblockNoticeModal: React.FC = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const seen = sessionStorage.getItem(STORAGE_KEY);
      if (!seen) {
        setOpen(true);
      }
    } catch {
      setOpen(true);
    }
  }, []);

  const handleDismiss = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // Ignore storage errors
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
          Viewing Tip
        </p>
        <h2 id="adblock-notice-title" className="mt-2 text-xl font-semibold tracking-tight">
          Best Streaming Experience
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-300">
          Since Petrovest uses external third-party streaming servers, you may encounter frequent pop-up ads when pressing play.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-zinc-300">
          We strongly recommend using an ad blocker like{" "}
          <span className="font-semibold text-white">uBlock Origin</span> or a browser like{" "}
          <span className="font-semibold text-white">Brave</span> for the best, uninterrupted experience.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
          <a
            href={["https://", "brave.com"].join("")}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-zinc-700 bg-zinc-900 px-4 py-2 text-xs font-mono uppercase tracking-wider text-zinc-200 transition-colors hover:bg-zinc-800"
          >
            Get Brave &nearr;
          </a>
          <button
            type="button"
            onClick={handleDismiss}
            className="border border-zinc-100 bg-zinc-100 px-5 py-2 text-xs font-mono font-semibold uppercase tracking-wider text-zinc-950 transition-colors hover:bg-zinc-300"
          >
            Got It, Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdblockNoticeModal;
