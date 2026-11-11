"use client";

import React, { useState } from "react";
import Link from "next/link";
import { tmdb } from "@/api/tmdb-client";
import DownloadDrawer from "@/components/ui/overlay/DownloadDrawer";
import { Spinner } from "@heroui/react";

interface SearchHit {
  id: number;
  media_type: "movie" | "tv";
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  poster_path?: string | null;
  overview?: string;
}

export default function DownloadsHubPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchHit[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    title: string;
    tmdbId: string;
    imdbId: string | null;
    type: "movie" | "tv";
    season?: number;
    episode?: number;
  } | null>(null);
  const [resolvingId, setResolvingId] = useState<number | null>(null);

  const [tvPicker, setTvPicker] = useState<{
    id: number;
    title: string;
    imdbId: string | null;
    seasons: number;
  } | null>(null);
  const [seasonInput, setSeasonInput] = useState(1);
  const [episodeInput, setEpisodeInput] = useState(1);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    setSearching(true);
    setTvPicker(null);

    try {
      const [movieRes, tvRes] = await Promise.all([
        tmdb.search.movies({ query: trimmed }).catch(() => ({ results: [] })),
        tmdb.search.tvShows({ query: trimmed }).catch(() => ({ results: [] })),
      ]);

      const movies: SearchHit[] = (movieRes.results || []).slice(0, 8).map((m: any) => ({
        id: m.id,
        media_type: "movie",
        title: m.title,
        release_date: m.release_date,
        poster_path: m.poster_path,
        overview: m.overview,
      }));

      const shows: SearchHit[] = (tvRes.results || []).slice(0, 8).map((s: any) => ({
        id: s.id,
        media_type: "tv",
        name: s.name,
        first_air_date: s.first_air_date,
        poster_path: s.poster_path,
        overview: s.overview,
      }));

      setResults([...movies, ...shows]);
    } finally {
      setSearching(false);
    }
  };

  const handleSelectTitle = async (item: SearchHit) => {
    setResolvingId(item.id);
    const displayTitle = item.title || item.name || "Untitled";

    try {
      if (item.media_type === "movie") {
        const details: any = await tmdb.movies.details(item.id);
        setSelectedItem({
          title: displayTitle,
          tmdbId: String(item.id),
          imdbId: details?.imdb_id || null,
          type: "movie",
        });
      } else {
        const details: any = await tmdb.tvShows.details(item.id);
        setSeasonInput(1);
        setEpisodeInput(1);
        setTvPicker({
          id: item.id,
          title: displayTitle,
          imdbId: details?.external_ids?.imdb_id || details?.imdb_id || null,
          seasons: details?.number_of_seasons || 1,
        });
      }
    } finally {
      setResolvingId(null);
    }
  };

  const openTvEpisodeDownload = () => {
    if (!tvPicker) return;
    setSelectedItem({
      title: `${tvPicker.title} S${seasonInput}E${episodeInput}`,
      tmdbId: String(tvPicker.id),
      imdbId: tvPicker.imdbId,
      type: "tv",
      season: seasonInput,
      episode: episodeInput,
    });
  };

  return (
    <main className="min-h-dvh bg-zinc-950 px-4 py-10 text-zinc-100 md:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-6">
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-400">
              Petrovest Cloud Download Center
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Direct Movie &amp; Series Downloads
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              Search any movie or series below to fetch exact file sizes and launch in-browser cloud downloads.
            </p>
          </div>

          <Link
            href="/"
            className="border border-zinc-700 bg-zinc-900 px-4 py-2 text-xs font-mono uppercase tracking-wider text-zinc-200 transition-colors hover:bg-zinc-800"
          >
            &larr; Back to Streaming
          </Link>
        </header>

        <div className="mb-6 border border-amber-500/40 bg-amber-950/30 px-4 py-3 text-xs font-mono text-amber-200">
          Some of the download links may not work properly, please bear with us as we work towards fixing it.
        </div>

        <form onSubmit={handleSearch} className="mb-8 flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movie or TV series title (e.g., Dune, Breaking Bad)..."
            className="min-h-12 flex-1 border border-zinc-800 bg-zinc-900 px-4 text-sm text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={searching}
            className="min-h-12 border border-zinc-100 bg-zinc-100 px-6 text-xs font-mono font-semibold uppercase tracking-wider text-zinc-950 transition-colors hover:bg-zinc-300 disabled:opacity-50"
          >
            {searching ? "Searching..." : "Search"}
          </button>
        </form>

        {tvPicker && (
          <div className="mb-8 border border-zinc-700 bg-zinc-900/80 p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-zinc-100">
                Select Episode — {tvPicker.title}
              </h2>
              <button
                type="button"
                onClick={() => setTvPicker(null)}
                className="text-xs font-mono text-zinc-400 hover:text-white"
              >
                Close &times;
              </button>
            </div>
            <div className="mt-4 flex flex-wrap items-end gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400">Season</label>
                <input
                  type="number"
                  min={1}
                  max={tvPicker.seasons}
                  value={seasonInput}
                  onChange={(e) => setSeasonInput(Math.max(1, Number(e.target.value)))}
                  className="mt-1 h-10 w-24 border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-100"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400">Episode</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={episodeInput}
                  onChange={(e) => setEpisodeInput(Math.max(1, Number(e.target.value)))}
                  className="mt-1 h-10 w-24 border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-100"
                />
              </div>
              <button
                type="button"
                onClick={openTvEpisodeDownload}
                className="h-10 border border-zinc-100 bg-zinc-100 px-5 text-xs font-mono font-semibold uppercase tracking-wider text-zinc-950 hover:bg-zinc-300"
              >
                Get Episode Files &darr;
              </button>
            </div>
          </div>
        )}

        {searching ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" variant="simple" />
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {results.map((item) => {
              const displayTitle = item.title || item.name || "Untitled";
              const year = (item.release_date || item.first_air_date || "").slice(0, 4);
              return (
                <div
                  key={`${item.media_type}-${item.id}`}
                  className="flex items-center justify-between gap-4 border border-zinc-800 bg-zinc-900/50 p-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="border border-zinc-700 bg-zinc-950 px-1.5 py-0.5 text-[10px] font-mono uppercase text-zinc-400">
                        {item.media_type}
                      </span>
                      {year && <span className="text-xs font-mono text-zinc-500">{year}</span>}
                    </div>
                    <h3 className="mt-1.5 truncate text-sm font-semibold text-zinc-100">
                      {displayTitle}
                    </h3>
                  </div>

                  <button
                    type="button"
                    disabled={resolvingId === item.id}
                    onClick={() => handleSelectTitle(item)}
                    className="shrink-0 border border-zinc-100 bg-zinc-100 px-3.5 py-2 text-xs font-mono font-semibold uppercase tracking-wider text-zinc-950 transition-colors hover:bg-zinc-300 disabled:opacity-50"
                  >
                    {resolvingId === item.id ? "Loading..." : "Download ↓"}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="border border-zinc-800/70 bg-zinc-900/20 px-6 py-12 text-center text-sm text-zinc-500">
            Enter a movie or series name above to search for direct browser downloads.
          </div>
        )}
      </div>

      {selectedItem && (
        <DownloadDrawer
          opened={Boolean(selectedItem)}
          onClose={() => setSelectedItem(null)}
          title={selectedItem.title}
          tmdbId={selectedItem.tmdbId}
          imdbId={selectedItem.imdbId}
          type={selectedItem.type}
          season={selectedItem.season}
          episode={selectedItem.episode}
        />
      )}
    </main>
  );
}
