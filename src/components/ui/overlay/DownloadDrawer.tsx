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
  tmdbId,
  imdbId,
  type,
  season,
  episode,
}) => {
  const [activeTab, setActiveTab] = useState<"direct" | "torrent">("direct");
  const [torrents, setTorrents] = useState<TorrentOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const directMirrors =
    type === "movie"
      ? [
          {
            name: "Mirror 1 — VidSrc Direct (MP4 / MKV)",
            badge: "Recommended",
            url: ["https://", "dl.vidsrc.vip", "/movie/", tmdbId].join(""),
          },
          {
            name: "Mirror 2 — VidLink Web Downloader",
            badge: "Fast",
            url: ["https://", "vidlink.pro", "/movie/", tmdbId, "?download=true"].join(""),
          },
          {
            name: "Mirror 3 — 2Embed Download Server",
            badge: "Backup",
            url: ["https://", "www.2embed.cc", "/embed/", tmdbId].join(""),
          },
        ]
      : [
          {
            name: `Mirror 1 — VidSrc Direct (S${season}E${episode})`,
            badge: "Recommended",
            url: ["https://", "dl.vidsrc.vip", "/tv/", tmdbId, "/", String(season), "/", String(episode)].join(""),
          },
          {
            name: "Mirror 2 — VidLink Episode Downloader",
            badge: "Fast",
            url: ["https://", "vidlink.pro", "/tv/", tmdbId, "/", String(season), "/", String(episode), "?download=true"].join(""),
          },
          {
            name: "Mirror 3 — 2Embed Episode Server",
            badge: "Backup",
            url: ["https://", "www.2embed.cc", "/embedtv/", tmdbId, "&s=", String(season), "&e=", String(episode)].join(""),
          },
        ];

  useEffect(() => {
    if (!opened || type !== "movie" || !imdbId) return;

    let cancelled = false;
    setLoading(true);

    fetch(`/api/downloads?imdbId=${encodeURIComponent(imdbId)}&title=${encodeURIComponent(title)}`)
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
  }, [opened, type, imdbId, title]);

  const handleCopyMagnet = async (magnet: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(magnet);
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      // Fallback ignored
    }
  };

  return (
    <VaulDrawer open={opened} onClose={onClose} backdrop="blur" title={`Download — ${title}`}>
      <div className="px-6 pb-8 pt-2 text-zinc-100">
        {type === "movie" && (
          <div className="mb-5 flex border border-zinc-800 bg-zinc-950 p-1">
            <button
              type="button"
              onClick={() => setActiveTab("direct")}
              className={`flex-1 py-2 text-xs font-mono uppercase tracking-wider transition-colors ${
                activeTab === "direct"
                  ? "bg-zinc-100 text-zinc-950 font-semibold"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Direct Browser Download
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("torrent")}
              className={`flex-1 py-2 text-xs font-mono uppercase tracking-wider transition-colors ${
                activeTab === "torrent"
                  ? "bg-zinc-100 text-zinc-950 font-semibold"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Fast Torrent / 1DM {torrents.length > 0 ? `(${torrents.length})` : ""}
            </button>
          </div>
        )}

        {(activeTab === "direct" || type === "tv") && (
          <div className="space-y-3">
            <p className="text-xs text-zinc-400">
              Opens an external download mirror in a new tab. Choose your preferred resolution on the mirror page.
            </p>
            {directMirrors.map((mirror) => (
              <a
                key={mirror.name}
                href={mirror.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between border border-zinc-800 bg-zinc-900/70 px-4 py-3 text-sm font-medium text-zinc-100 transition-colors hover:border-zinc-600 hover:bg-zinc-800"
              >
                <span>{mirror.name}</span>
                <span className="border border-zinc-700 bg-zinc-950 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-zinc-300">
                  {mirror.badge} &nearr;
                </span>
              </a>
            ))}
          </div>
        )}

        {activeTab === "torrent" && type === "movie" && (
          <div className="space-y-3">
            <p className="text-xs text-zinc-400">
              Verified releases with exact file sizes. Open with 1DM, LibreTorrent, or qBittorrent.
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

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyMagnet(item.magnet, index)}
                      className="border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-xs font-mono text-zinc-300 hover:bg-zinc-800 hover:text-white"
                    >
                      {copiedIndex === index ? "Copied!" : "Copy Magnet"}
                    </button>
                    <a
                      href={item.magnet}
                      className="border border-zinc-100 bg-zinc-100 px-3 py-1.5 text-xs font-mono font-semibold text-zinc-950 hover:bg-zinc-300"
                    >
                      Open Magnet
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="border border-zinc-800 bg-zinc-900/40 px-4 py-6 text-center text-xs text-zinc-400">
                No indexed torrent releases found for this title yet. Switch to the{" "}
                <button
                  type="button"
                  onClick={() => setActiveTab("direct")}
                  className="underline text-zinc-200"
                >
                  Direct Browser Download
                </button>{" "}
                tab to save directly via Chrome.
              </div>
            )}
          </div>
        )}
      </div>
    </VaulDrawer>
  );
};

export default DownloadDrawer;
