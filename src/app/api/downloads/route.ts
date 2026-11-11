import { NextRequest, NextResponse } from "next/server";

export interface TorrentOption {
  quality: string;
  type: string;
  size: string;
  seeds: number;
  magnet: string;
  url: string;
}

const TRACKERS = [
  "udp://tracker.opentrackr.org:1337/announce",
  "udp://open.tracker.cl:1337/announce",
  "udp://tracker.torrent.eu.org:451/announce",
  "udp://tracker.dler.org:6969/announce",
  "udp://open.stealth.si:80/announce",
];

const buildMagnet = (hash: string, title: string) => {
  const dn = encodeURIComponent(title);
  const tr = TRACKERS.map((t) => `&tr=${encodeURIComponent(t)}`).join("");
  return `magnet:?xt=urn:btih:${hash}&dn=${dn}${tr}`;
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imdbId = searchParams.get("imdbId");
  const title = searchParams.get("title") || "Petrovest Download";

  if (!imdbId || !/^tt\d+$/.test(imdbId)) {
    return NextResponse.json({ torrents: [] });
  }

  try {
    const apiBase = ["https://", "yts.mx", "/api/v2/movie_details.json"].join("");
    const res = await fetch(`${apiBase}?imdb_id=${imdbId}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json({ torrents: [] });
    }

    const json = await res.json();
    const rawTorrents = json?.data?.movie?.torrents ?? [];

    const torrents: TorrentOption[] = rawTorrents.map((t: any) => ({
      quality: t.quality || "HD",
      type: (t.type || "web").toUpperCase(),
      size: t.size || "Unknown",
      seeds: Number(t.seeds) || 0,
      magnet: buildMagnet(t.hash, `${title} [${t.quality}]`),
      url: t.url || "",
    }));

    return NextResponse.json({ torrents });
  } catch {
    return NextResponse.json({ torrents: [] });
  }
}
