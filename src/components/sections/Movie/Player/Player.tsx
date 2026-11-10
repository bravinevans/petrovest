"use client";

import { siteConfig } from "@/config/site";
import { usePlayerEvents } from "@/hooks/usePlayerEvents";
import { mutateMovieTitle } from "@/utils/movies";
import { useDocumentTitle } from "@mantine/hooks";
import { useState } from "react";
import { MovieDetails } from "tmdb-ts/dist/types/movies";

interface MoviePlayerProps {
  movie: MovieDetails;
  startAt?: number;
}

const IFRAME_SANDBOX =
  "allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation-by-user-activation";

const MoviePlayer: React.FC<MoviePlayerProps> = ({ movie }) => {
  const [selectedServer, setSelectedServer] = useState(0);
  const tmdbId = String(movie.id);
  const title = mutateMovieTitle(movie);

  const servers = [
    { label: "Server 1 (VidLink)", src: `https://vidlink.pro{tmdbId}` },
    { label: "Server 2 (VidSrc To)", src: `https://vidsrc.sh{tmdbId}` },
    { label: "Server 3 (SuperEmbed)", src: `https://multiembed.eu{tmdbId}&tmdb=1` },
    { label: "Server 4 (VidSrc Me)", src: `https://vidsrc.me{tmdbId}` },
    { label: "Server 5 (2Embed)", src: `https://2embed.cc{tmdbId}` },
    { label: "Server 6 (AutoEmbed)", src: `https://autoembed.cc{tmdbId}` },
    { label: "Server 7 (NonoEmbed)", src: `https://nono.id{tmdbId}` },
    { label: "Server 8 (MovieAPI)", src: `https://mocah.org{tmdbId}` },
    { label: "Server 9 (SmashStream)", src: `https://smashystream.com{tmdbId}` },
    { label: "Server 10 (Flicktstream)", src: `https://flicktstream.com{tmdbId}` }
  ];

  usePlayerEvents({ saveHistory: true });
  useDocumentTitle(`Play ${title} | ${siteConfig.name}`);

  const activeServer = servers[selectedServer];

  return (
    <main className="min-h-dvh bg-zinc-950 px-4 py-6 text-zinc-100 md:px-8 md:py-10">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-5 border-b border-zinc-800 pb-4">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
            Petrovest Streaming
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
        </header>

        <div className="aspect-video w-full overflow-hidden border border-zinc-800 bg-zinc-900">
          <iframe
            key={`${tmdbId}-${selectedServer}`}
            src={activeServer.src}
            title={`${title} — ${activeServer.label}`}
            allowFullScreen
            sandbox={IFRAME_SANDBOX}
            referrerPolicy="no-referrer"
            className="block size-full"
          />
        </div>

        <nav
          aria-label="Choose a streaming server"
          className="mt-4 flex flex-wrap items-center gap-2 border-b border-zinc-800 pb-4"
        >
          {servers.map((server, index) => {
            const isActive = selectedServer === index;

            return (
              <button
                key={server.label}
                type="button"
                aria-pressed={isActive}
                onClick={() => setSelectedServer(index)}
                className={`min-h-10 border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-300 ${
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
    </main>
  );
};

MoviePlayer.displayName = "MoviePlayer";

export default MoviePlayer;
