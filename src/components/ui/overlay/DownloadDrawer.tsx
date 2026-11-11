"use client";

import React, { useEffect, useState } from "react";
import VaulDrawer from "@/components/ui/overlay/VaulDrawer";
import { Spinner } from "@heroui/react";
import type { TorrentOption } from "@/app/api/downloads/route";

export interface DownloadDrawerProps {
  opened: boolean;
  onClose: () => void;
  title: string;
  tmdbId: string;
  imdbId?: string | null;
  type: "movie" | "tv";
  season?: number;
  episode?: number;
}

export const DownloadDrawer: React.FC<DownloadDrawerProps> = ({
  opened,
  onClose,
  title,
  imdbId,
  type,
  season,
  episode,
}) => {
  const [activeTab, setActiveTab] = useState<"torrents" | "grabber">("torrents");
  const [torrents, setTorrents] = useState<TorrentOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!opened || !imdbId) return;

    let cancelled = false;
    setLoading(true);

    const params = new URLSearchParams({
      imdbId,
      title,
      type,
      ...(season !== undefined ? { season: String(season) } : {}),
      ...(episode !== undefined ? { episode: String(episode) } : {}),
    });

    fetch(`/api/downloads?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          const list = data.torrents || [];
          setTorrents(list);
          if (list.length === 0) setActiveTab("grabber");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setTorrents([]);
          setActiveTab("grabber");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [opened, type, imdbId, title, season, episode]);

  const handleCopyMagnet = async (magnet: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(magnet);
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      // Clipboard fallback ignored
    }
  };

  const openIn1DM = () => {
    if (typeof window === "undefined") return;
    const currentUrl = window.location.href.replace(/^https?:\/\//, "");
    window.location.href = `intent://${currentUrl}#Intent;scheme=https;package=idm.internet.download.manager;end`;
  };

  return (
    <VaulDrawer open={opened} onClose={onClose} backdrop="blur" title={`Download — ${title}`}>
      <div className="px-6 pb-8 pt-2 text-zinc-100">
        <div className="mb-5 flex border border-zinc-800 bg-zinc-950 p-1">
          <button
            type="button"
            onClick={() => setActiveTab("torrents")}
            className={`flex-1 py-2 text-xs font-mono uppercase tracking-wider transition-colors ${
              activeTab === "torrents"
                ? "bg-zinc-100 text-zinc-950 font-semibold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Direct Releases {torrents.length > 0 ? `(${torrents.length})` : ""}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("grabber")}
            className={`flex-1 py-2 text-xs font-mono uppercase tracking-wider transition-colors ${
              activeTab === "grabber"
                ? "bg-zinc-100 text-zinc-950 font-semibold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Browser / 1DM Grabber
          </button>
        </div>

        {activeTab === "torrents" && (
          <div className="space-y-3">
            <p className="text-xs text-zinc-400">
              Verified releases with exact file sizes. Use 1DM, LibreTorrent, or qBittorrent to save directly to your device.
            </p>

            {loading ? (
              <div className="flex justify-center py-8">
                <Spinner size="md" variant="simple" />
              </div>
            ) : torrents.length > 0 ? (
              torrents.map((item, index) => (
                <div
                  key={`${item.quality}-${item.type}-${index}`}
                  className="flex flex-wrap items-center justify-between gap-3 border border-zinc-800 bg-zinc-900/70 px-4 py-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-zinc-100">{item.quality}</span>
                      <span className="border border-zinc-700 bg-zinc-950 px-1.5 py-0.5 text-[10px] font-mono text-zinc-300">
                        {item.type}
                      </span>
                    </div>
                    <p className="mt-1 text-xs font-mono text-zinc-400">
                      Size: {item.size} &bull; Seeds: {item.seeds}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyMagnet(item.magnet, index)}
                      className="border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-xs font-mono text-zinc-300 hover:bg-zinc-800 hover:text-white"
                    >
                      {copiedIndex === index ? "Copied!" : "Copy Magnet"}
                    </button>
                    {item.torrentUrl && (
                      <a
                        href={item.torrentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs font-mono text-zinc-200 hover:bg-zinc-800"
                      >
                        .Torrent
                      </a>
                    )}
                    <a
                      href={item.magnet}
                      className="border border-zinc-100 bg-zinc-100 px-3 py-1.5 text-xs font-mono font-semibold text-zinc-950 hover:bg-zinc-300"
                    >
                      Download
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="border border-zinc-800 bg-zinc-900/40 px-4 py-6 text-center text-xs text-zinc-400">
                No indexed releases found for this title yet. Switch to the{" "}
                <button
                  type="button"
                  onClick={() => setActiveTab("grabber")}
                  className="underline text-zinc-200"
                >
                  Browser / 1DM Grabber
                </button>{" "}
                tab to capture the live video stream directly.
              </div>
            )}
          </div>
        )}

        {activeTab === "grabber" && (
          <div className="space-y-4">
            <div className="border border-zinc-800 bg-zinc-900/70 p-4">
              <h3 className="text-sm font-semibold text-zinc-100">Android (1DM Download Manager)</h3>
              <p className="mt-1 text-xs text-zinc-400">
                Opens this exact player page inside 1DM&apos;s built-in browser so it automatically detects and downloads the MP4/HLS video stream as soon as you press Play.
              </p>
              <button
                type="button"
                onClick={openIn1DM}
                className="mt-3 w-full border border-zinc-100 bg-zinc-100 px-4 py-2.5 text-xs font-mono font-semibold uppercase tracking-wider text-zinc-950 transition-colors hover:bg-zinc-300"
              >
                Open Page in 1DM App &nearr;
              </button>
            </div>

            <div className="border border-zinc-800 bg-zinc-900/40 p-4">
              <h3 className="text-sm font-semibold text-zinc-100">Desktop (Chrome / Edge / Firefox)</h3>
              <p className="mt-1 text-xs text-zinc-400">
                Install the free <strong>Video DownloadHelper</strong> or <strong>CocoCut</strong> browser extension, press Play on Server 1 or Server 2, and click the extension icon to save the full HD stream directly to your PC.
              </p>
            </div>
          </div>
        )}
      </div>
    </VaulDrawer>
  );
};

export default DownloadDrawer;
