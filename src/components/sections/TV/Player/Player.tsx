"use client";

import { siteConfig } from "@/config/site";
import { useDocumentTitle } from "@mantine/hooks";
import Link from "next/link";
import { useState } from "react";
import { Episode, TvShowDetails } from "tmdb-ts";
import EpisodeSelection from "./EpisodeSelection";

export interface TvShowPlayerProps {
  tv: TvShowDetails;
  id: number;
  seriesName: string;
  seasonName: string;
  episode: Episode;
  episodes: Episode[];
  nextEpisodeNumber: number | null;
  prevEpisodeNumber: number | null;
  startAt?: number;
}

const IFRAME_SANDBOX =
  "allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation allow-top-navigation-by-user-activation";

const TvShowPlayer: React.FC<TvShowPlayerProps> = ({
  id,
  seriesName,
  seasonName,
  episode,
  episodes,
  nextEpisodeNumber,
  prevEpisodeNumber,
}) => {
  const [selectedServer, setSelectedServer] = useState(0);
  const [episodeSelectionOpen, setEpisodeSelectionOpen] = useState(false);
  const tmdbId = String(id);
  const season = episode.season_number;
  const episodeNumber = episode.episode_number;

  const servers = [
    { label: "Server 1 (VidLink)", src: `https://vidlink.pro{tmdbId}/${season}/${episodeNumber}` },
    { label: "Server 2 (VidSrc To)", src: `https://vidsrc.sh{tmdbId}/${season}/${episodeNumber}` },
    { label: "Server 3 (SuperEmbed)", src: `https://multiembed.eu{tmdbId}&tmdb=1&s=${season}&e=${episodeNumber}` },
    { label: "Server 4 (VidSrc Me)", src: `https://vidsrc.me{tmdbId}/${season}/${episodeNumber}` },
    { label: "Server 5 (2Embed)", src: `https://2embed.cc{tmdbId}&s=${season}&e=${episodeNumber}` },
    { label: "Server 6 (AutoEmbed)", src: `https://autoembed.cc{tmdbId}/${season}/${episodeNumber}` },
    { label: "Server 7 (NonoEmbed)", src: `https://nono.id{tmdbId}/${season}/${episodeNumber}` },
    { label: "Server 8 (SmashStream)", src: `https://smashystream.com{tmdbId}&season=${season}&episode=${episodeNumber}` },
    { label: "Server 9 (Flicktstream)", src: `https://flicktstream.com{tmdbId}/${season}/${episodeNumber}` }
  ];

  useDocumentTitle(`Play ${seriesName} - ${seasonName} - ${episode.name} | ${siteConfig.name}`);

  const activeServer = servers[selectedServer];
  const previousHref = prevEpisodeNumber ? `/tv/${id}/${season}/${prevEpisodeNumber}/player` : undefined;
  const nextHref = nextEpisodeNumber ? `/tv/${id}/${season}/${nextEpisodeNumber}/player` : undefined;

  return (
    <main className="min-h-dvh bg-zinc-950 px-4 py-6 text-zinc-100 md:px-8 md:py-10">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-5 flex flex-wrap items-end justify-between gap-4 border-b border-zinc-800 pb-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
              Petrovest Streaming
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">{seriesName}</h1>
            <p className="mt-1 text-sm text-zinc-400">
              {seasonName} <span aria-hidden="true">/</span> Episode {episodeNumber}: {episode.name}
            </p>
          </div>

          <nav aria-label="Episode navigation" className="flex flex-wrap gap-2">
            {previousHref ? (
              <Link href={previousHref} className="border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-800">
                Previous episode
              </Link>
            ) : (
              <span className="border border-zinc-800 px-4 py-2 text-sm text-zinc-600">Previous episode</span>
            )}
            <button type="button" onClick={() => setEpisodeSelectionOpen(true)} className="border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-800">
              Episodes
            </button>
            {nextHref ? (
              <Link href={nextHref} className="border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-800">
                Next episode
              </Link>
            ) : (
              <span className="border border-zinc-800 px-4 py-2 text-sm text-zinc-600">Next episode</span>
            )}
          </nav>
        </header>

        <div className="aspect-video w-full overflow-hidden border border-zinc-800 bg-zinc-900">
          <iframe
            key={`${tmdbId}-${season}-${episodeNumber}-${selectedServer}`}
            src={activeServer.src}
            title={`${seriesName} — ${episode.name} — ${activeServer.label}`}
            allowFullScreen
            sandbox={IFRAME_SANDBOX}
            referrerPolicy="no-referrer"
            className="block size-full"
          />
        </div>

        <nav aria-label="Choose a streaming server" className="mt-4 flex flex-wrap items-center gap-2 border-b border-zinc-800 pb-4">
          {servers.map((server, index) => {
            const isActive = selectedServer === index;
            return (
              <button
                key={server.label}
                type="button"
                aria-pressed={isActive}
                onClick={() => setSelectedServer(index)}
                className={`min-h-10 border px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-zinc-100 bg-zinc-100 text-zinc-950"
                    : "border-zinc-700 bg-zinc-950 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                {server.label}
              </button>
            );
          })}
        </nav>
      </div>

      <EpisodeSelection id={id} opened={episodeSelectionOpen} onClose={() => setEpisodeSelectionOpen(false)} episodes={episodes} />
    </main>
  );
};

TvShowPlayer.displayName = "TvShowPlayer";
export default TvShowPlayer;
