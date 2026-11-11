"use client";

import DownloadDrawer from "@/components/ui/overlay/DownloadDrawer";
import { siteConfig } from "@/config/site";
import { usePlayerEvents } from "@/hooks/usePlayerEvents";
import { mutateMovieTitle } from "@/utils/movies";
import { useDocumentTitle } from "@mantine/hooks";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { MovieDetails } from "tmdb-ts/dist/types/movies";

interface MoviePlayerProps {
  movie: MovieDetails;
  startAt?: number;
}

const MoviePlayer: React.FC<MoviePlayerProps> = ({ movie, startAt }) => {
  const [selectedServer, setSelectedServer] = useState(0);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [redirectGuard, setRedirectGuard] = useState(true);
  const tmdbId = String(movie.id);
  const title = mutateMovieTitle(movie);

  usePlayerEvents({ saveHistory: true });
  useDocumentTitle(`Play ${title} | ${siteConfig.name}`);

  // Prevents external ad iframes from hijacking the main browser tab
  useEffect(() => {
    if (!redirectGuard) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [redirectGuard]);

  const servers = useMemo(() => [
    {
      label: "Server 1 (VidLink Alt)",
      src: ["https://", "vidlink.pro", "/movie/", tmdbId, "?download=true"].join(""),
    },
    {
      label: "Server 2 (SmashStream)",
      src: ["https://", "embed.", "smashystream.com", "/playere.php?tmdb=", tmdbId].join(""),
    },
    {
      label: "Server 3 (2Embed)",
      src: ["https://", "www.2embed.cc", "/embed/", tmdbId].join(""),
    },
    {
      label: "Server 4 (VidSrc SH)",
      src: ["https://", "vidsrc.sh", "/embed/movie/", tmdbId].join(""),
    },
    {
      label: "Server 5 (VidSrc Me)",
      src: ["https://", "vidsrc.me", "/embed/movie/", tmdbId].join(""),
    },
    {
      label: "Server 6 (NontonGo)",
      src: ["https://", "www.nontongo.win", "/embed/movie/", tmdbId].join(""),
    },
    {
      label: "Server 7 (VidLink)",
      src: ["https://", "vidlink.pro", "/movie/", tmdbId, "?autoplay=false", startAt ? `&startAt=${startAt}` : ""].join(""),
    },
  ], [tmdbId, startAt]);

  const activeServer = servers[selectedServer] || servers.at(0)!;

  return (
    <main className="min-h-dvh bg-zinc-950 px-4 py-6 text-zinc-100 md:px-8 md:py-10">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-5 flex flex-wrap items-end justify-between gap-4 border-b border-zinc-800 pb-4">
          <div>
            <div className="mb-3">
              <Link
                href={`/movie/${tmdbId}`}
                onClick={() => setRedirectGuard(false)}
                className="inline-flex items-center gap-2 border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
              >
                <span aria-hidden="true">&larr;</span>
                <span>Back to movie</span>
              </Link>
            </div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
              Petrovest Streaming
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
          </div>

          <button
            type="button"
            onClick={() => setDownloadOpen(true)}
            className="min-h-10 border border-zinc-100 bg-zinc-100 px-4 py-2 text-xs font-mono font-semibold uppercase tracking-wider text-zinc-950 transition-colors hover:bg-zinc-300"
          >
            Download Movie &darr;
          </button>
        </header>

        <div className="aspect-video w-full overflow-hidden border border-zinc-800 bg-zinc-900">
          <iframe
            key={`${tmdbId}-${selectedServer}`}
            src={activeServer.src}
            title={`${title} — ${activeServer.label}`}
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            className="block size-full border-none"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
          <nav aria-label="Choose a streaming server" className="flex flex-wrap items-center gap-2">
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

          <button
            type="button"
            aria-pressed={redirectGuard}
            onClick={() => setRedirectGuard((prev) => !prev)}
            className={`min-h-10 border px-3 py-2 text-xs font-mono transition-colors ${
              redirectGuard
                ? "border-emerald-500/40 bg-emerald-950/30 text-emerald-300"
                : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {redirectGuard ? "Redirect Guard: ON" : "Redirect Guard: OFF"}
          </button>
        </div>
      </div>

      <DownloadDrawer
        opened={downloadOpen}
        onClose={() => setDownloadOpen(false)}
        title={title}
        tmdbId={tmdbId}
        imdbId={movie.imdb_id}
        type="movie"
      />
    </main>
  );
};

MoviePlayer.displayName = "MoviePlayer";
export default MoviePlayer;
