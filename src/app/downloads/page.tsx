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
  const [noticeOpen, setNoticeOpen] = useState(true);
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
    <div className="mx-auto w-full max-w-4xl py-6">
      {noticeOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="downloads-notice-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4"
        >
          <div className="w-full max-w-md rounded-xl border border-divider bg-content1 p-6 text-foreground shadow-xl">
            <h2 id="downloads-notice-title" className="text-lg font-semibold">
              Downloads Notice
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-default-500">
              We are aware that some download links are currently unavailable. Thank you for your patience as our team works to resolve the issue.
            </p>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setNoticeOpen(false)}
                className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-divider pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Downloads</h1>
          <p className="mt-1 text-sm text-default-500">
            Search any movie or series to check available sizes and download options.
          </p>
        </div>

        <Link
          href="/"
          className="rounded-lg border border-divider bg-content1 px-4 py-2 text-sm font-medium transition-colors hover:bg-content2"
        >
          Back to Home
        </Link>
      </header>

      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movie or TV series..."
          className="h-11 flex-1 rounded-lg border border-divider bg-content1 px-4 text-sm text-foreground placeholder-default-400 focus:border-foreground focus:outline-none"
        />
        <button
          type="submit"
          disabled={searching}
          className="h-11 rounded-lg bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {searching ? "Searching..." : "Search"}
        </button>
      </form>

      {tvPicker && (
        <div className="mb-6 rounded-xl border border-divider bg-content1 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Select Episode — {tvPicker.title}</h2>
            <button
              type="button"
              onClick={() => setTvPicker(null)}
              className="text-sm text-default-500 hover:text-foreground"
            >
              Close
            </button>
          </div>
          <div className="mt-4 flex flex-wrap items-end gap-4">
            <div>
              <label className="block text-xs font-medium text-default-500">Season</label>
              <input
                type="number"
                min={1}
                max={tvPicker.seasons}
                value={seasonInput}
                onChange={(e) => setSeasonInput(Math.max(1, Number(e.target.value)))}
                className="mt-1 h-10 w-24 rounded-lg border border-divider bg-content2 px-3 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-default-500">Episode</label>
              <input
                type="number"
                min={1}
                max={100}
                value={episodeInput}
                onChange={(e) => setEpisodeInput(Math.max(1, Number(e.target.value)))}
                className="mt-1 h-10 w-24 rounded-lg border border-divider bg-content2 px-3 text-sm"
              />
            </div>
            <button
              type="button"
              onClick={openTvEpisodeDownload}
              className="h-10 rounded-lg bg-foreground px-4 text-sm font-medium text-background hover:opacity-90"
            >
              Get Files
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
                className="flex items-center justify-between gap-4 rounded-xl border border-divider bg-content1 p-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-xs text-default-500">
                    <span className="capitalize">{item.media_type}</span>
                    {year && <span>• {year}</span>}
                  </div>
                  <h3 className="mt-1 truncate text-sm font-semibold">{displayTitle}</h3>
                </div>

                <button
                  type="button"
                  disabled={resolvingId === item.id}
                  onClick={() => handleSelectTitle(item)}
                  className="shrink-0 rounded-lg bg-foreground px-3.5 py-2 text-xs font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {resolvingId === item.id ? "Loading..." : "Download"}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-divider bg-content1/50 px-6 py-12 text-center text-sm text-default-500">
          Search for a movie or TV series above to view download options.
        </div>
      )}

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
    </div>
  );
}
