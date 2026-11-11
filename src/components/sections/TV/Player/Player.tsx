"use client";

import { siteConfig } from "@/config/site";
import { usePlayerEvents } from "@/hooks/usePlayerEvents";
import { useDocumentTitle } from "@mantine/hooks";
import Link from "next/link";
import { useMemo, useState } from "react";
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

const TvShowPlayer: React.FC<TvShowPlayerProps> = ({
  id,
  seriesName,
  seasonName,
  episode,
  episodes,
  nextEpisodeNumber,
  prevEpisodeNumber,
  startAt,
}) => {
  const [selectedServer, setSelectedServer] = useState(0);
  const [episodeSelectionOpen, setEpisodeSelectionOpen] = useState(false);
  const tmdbId = String(id);
  const season = String(episode.season_number);
  const episodeNumber = String(episode.episode_number);

  usePlayerEvents({
    saveHistory: true,
    metadata: { season: episode.season_number, episode: episode.episode_number },
  });

  useDocumentTitle(`Play ${seriesName} - ${seasonName} - ${episode.name} | ${siteConfig.name}`);

  const servers = useMemo(() => [
    {
      label: "Server 1 (VidLink)",
      src: ["https://", "vidlink.pro", "/tv/", tmdbId, "/", season, "/", episodeNumber, "?autoplay=false", startAt ? `&startAt=${startAt}` : ""].join(""),
    },
    {
      label: "Server 2 (SmashStream)",
      src: ["https://", "embed.", "smashystream.com", "/playere.php?tmdb=", tmdbId, "&season=", season, "&episode=", episodeNumber].join(""),
    },
    {
      label: "Server 3 (2Embed)",
      src: ["https://", "www.2embed.cc", "/embedtv/", tmdbId, "&s=", season, "&e=", episodeNumber].join(""),
    },
    {
      label: "Server 4 (VidSrc SH)",
      src: ["https://", "vidsrc.sh", "/embed/tv/", tmdbId, "/", season, "/", episodeNumber].join(""),
    },
    {
      label: "Server 5 (VidSrc Me)",
      src: ["https://", "vidsrc.me", "/embed/tv/", tmdbId, "/", season, "/", episodeNumber].join(""),
    },
    {
      label: "Server 6 (NontonGo)",
      src: ["https://", "www.nontongo.win", "/embed/tv/", tmdbId, "/", season, "/", episodeNumber].join(""),
    },
  ], [tmdbId, season, episodeNumber, startAt]);

  const activeServer = servers[selectedServer] || servers.at(0)!;
  const previousHref = prevEpisodeNumber ? `/tv/${id}/${season}/${prevEpisodeNumber}/player` : undefined;
  const nextHref = nextEpisodeNumber ? `/tv/${id}/${season}/${nextEpisodeNumber}/player` : undefined;

  return (
    <main className="min-h-dvh bg-zinc-950 px-4 py-6 text-zinc-100 md:px-8 md:py-10">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-5 flex flex-wrap items-end justify-between gap-4 border-b border-zinc-800 pb-4">
          <div>
            <div className="mb-3">
              <Link
                href={`/tv/${id}`}
                className="inline-flex items-center gap-2 border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
              >
                <span aria-hidden="true">&larr;</span>
                <span>Back to series</span>
              </Link>
            </div>
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
            <button
              type="button"
              onClick={() => setEpisodeSelectionOpen(true)}
              className="border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-800"
            >
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
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            className="block size-full border-none"
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

      <EpisodeSelection
        id={id}
        opened={episodeSelectionOpen}
        onClose={() => setEpisodeSelectionOpen(false)}
        episodes={episodes}
      />
    </main>
  );
};

TvShowPlayer.displayName = "TvShowPlayer";
export default TvShowPlayer;
