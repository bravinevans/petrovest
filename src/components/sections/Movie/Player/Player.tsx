"use client";

import { siteConfig } from "@/config/site";
import { usePlayerEvents } from "@/hooks/usePlayerEvents";
import { mutateMovieTitle } from "@/utils/movies";
import { useDocumentTitle } from "@mantine/hooks";
import { useMemo, useState } from "react";
import { MovieDetails } from "tmdb-ts/dist/types/movies";

interface MoviePlayerProps {
  movie: MovieDetails;
  startAt?: number;
}

const MoviePlayer: React.FC<MoviePlayerProps> = ({ movie, startAt }) => {
  const [selectedServer, setSelectedServer] = useState(0);
  const tmdbId = String(movie.id);
  const title = mutateMovieTitle(movie);

  usePlayerEvents({ saveHistory: true });
  useDocumentTitle(`Play ${title} | ${siteConfig.name}`);

  const servers = useMemo(() => [
    {
      label: "Server 1 (VidLink)",
      src: ["https://", "vidlink.pro", "/movie/", tmdbId, "?autoplay=false", startAt ? `&startAt=${startAt}` : ""].join(""),
    },
    {
      label: "Server 2 (VidSrc To)",
      src: ["https://", "vidsrc.to", "/embed/movie/", tmdbId].join(""),
    },
    {
      label: "Server 3 (VidSrc XYZ)",
      src: ["https://", "vidsrc.xyz", "/embed/movie/", tmdbId].join(""),
    },
    {
      label: "Server 4 (VidSrc CC)",
      src: ["https://", "vidsrc.cc", "/v2/embed/movie/", tmdbId, "?autoPlay=false"].join(""),
    },
    {
      label: "Server 5 (SuperEmbed)",
      src: ["https://", "multiembed.mov", "/directstream.php?video_id=", tmdbId, "&tmdb=1"].join(""),
    },
    {
      label: "Server 6 (2Embed)",
      src: ["https://", "www.2embed.cc", "/embed/", tmdbId].join(""),
    },
    {
      label: "Server 7 (AutoEmbed)",
      src: ["https://", "player.autoembed.cc", "/embed/movie/", tmdbId].join(""),
    },
    {
      label: "Server 8 (VidKing)",
      src: ["https://", "www.vidking.net", "/embed/movie/", tmdbId, "?autoplay=false"].join(""),
    },
    {
      label: "Server 9 (SmashStream)",
      src: ["https://", "embed.", "smashystream.com", "/playere.php?tmdb=", tmdbId].join(""),
    },
    {
      label: "Server 10 (MoviesAPI)",
      src: ["https://", "moviesapi.club", "/movie/", tmdbId].join(""),
    },
  ], [tmdbId, startAt]);

  const activeServer = servers[selectedServer] || servers;

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
    </main>
  );
};

MoviePlayer.displayName = "MoviePlayer";
export default MoviePlayer;
