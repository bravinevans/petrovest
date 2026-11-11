"use client";

import React, { useEffect, useRef, useState } from "react";
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

declare global {
  interface Window {
    webtor?: any[];
  }
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
  const [torrents, setTorrents] = useState<TorrentOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeMagnet, setActiveMagnet] = useState<string | null>(null);
  const [activeLabel, setActiveLabel] = useState<string>("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const sdkLoadedRef = useRef(false);

  useEffect(() => {
    if (!opened) {
      setActiveMagnet(null);
      return;
    }
    if (!imdbId) return;

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
        if (!cancelled) setTorrents(data.torrents || []);
      })
      .catch(() => {
        if (!cancelled) setTorrents([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [opened, type, imdbId, title, season, episode]);

  useEffect(() => {
    if (!activeMagnet || typeof window === "undefined") return;

    const container = document.getElementById("webtor-download-box");
    if (container) container.innerHTML = "";

    window.webtor = window.webtor || [];
    window.webtor.push({
      id: "webtor-download-box",
      magnet: activeMagnet,
      title: `${title} (${activeLabel})`,
      imdbId: imdbId || undefined,
      width: "100%",
      lang: "en",
      features: {
        download: true,
        subtitles: true,
        settings: true,
        fullscreen: true,
        playpause: true,
        currentTime: true,
        timeline: true,
        duration: true,
        volume: true,
        embed: false,
      },
    });

    if (!sdkLoadedRef.current) {
      const script = document.createElement("script");
      script.src = "https://jsdelivr.net";
      script.charset = "utf-8";
      script.async = true;
      document.body.appendChild(script);
      sdkLoadedRef.current = true;
    }
  }, [activeMagnet, activeLabel, title, imdbId]);

  const handleCopyMagnet = async (magnet: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(magnet);
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      // Clipboard fallback ignored
    }
  };

  const webSearchMirrors = [
    {
      name: "Direct Web Mirror — NKIRI (Fast MP4)",
      url: `https://nkiri.com{encodeURIComponent(title)}`,
    },
    {
      name: "Direct Web Mirror — FZMovies (Mobile MP4)",
      url: `https://google.com{encodeURIComponent(`site:fzmovies.net ${title}`)}`,
    },
    {
      name: "Direct Web Mirror — Pahe (720p / 1080p MKV)",
      url: `https://pahe.ink{encodeURIComponent(title)}`,
    },
  ];

  return (
    <VaulDrawer open={opened} onClose={onClose} backdrop="blur" title={`Download — ${title}`}>
      <div className="space-y-6 px-6 pb-8 pt-2 text-zinc-100">
        {activeMagnet && (
          <div className="border border-zinc-700 bg-zinc-950 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
                Cloud Downloader Active ({activeLabel}) — Click the Download Icon Inside
              </span>
              <button
                type="button"
                onClick={() => setActiveMagnet(null)}
                className="text-xs font-mono text-zinc-400 hover:text-white"
              >
                Close &times;
              </button>
            </div>
            <div id="webtor-download-box" className="min-h-[260px] w-full overflow-hidden bg-black" />
          </div>
        )}

        <div>
          <h3 className="mb-2 text-xs font-mono uppercase tracking-wider text-zinc-400">
            In-Browser Direct Downloads (Free Cloud Engine — No App Needed)
          </h3>

          {loading ? (
            <div className="flex justify-center py-6">
              <Spinner size="md" variant="simple" />
            </div>
          ) : torrents.length > 0 ? (
            <div className="space-y-2">
              {torrents.map((item, index) => (
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
                    <button
                      type="button"
                      onClick={() => {
                        setActiveMagnet(item.magnet);
                        setActiveLabel(`${item.quality} ${item.type}`);
                      }}
                      className="border border-zinc-100 bg-zinc-100 px-3 py-1.5 text-xs font-mono font-semibold text-zinc-950 hover:bg-zinc-300"
                    >
                      Download in Browser &darr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="border border-zinc-800 bg-zinc-900/40 px-4 py-4 text-xs text-zinc-400">
              No direct cloud releases indexed for this title yet. Use the web MP4 mirrors below.
            </p>
          )}
        </div>

        <div>
          <h3 className="mb-2 text-xs font-mono uppercase tracking-wider text-zinc-400">
            Backup Web MP4 / MKV Mirrors
          </h3>
          <div className="space-y-2">
            {webSearchMirrors.map((mirror) => (
              <a
                key={mirror.name}
                href={mirror.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between border border-zinc-800 bg-zinc-900/70 px-4 py-3 text-sm font-medium text-zinc-100 transition-colors hover:border-zinc-600 hover:bg-zinc-800"
              >
                <span>{mirror.name}</span>
                <span className="text-xs font-mono text-zinc-400">&nearr;</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </VaulDrawer>
  );
};

export default DownloadDrawer;
