import { NextRequest, NextResponse } from "next/server";

export interface TorrentOption {
  quality: string;
  type: string;
  size: string;
  seeds: number;
  magnet: string;
  torrentUrl?: string;
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
  const type = searchParams.get("type") || "movie";
  const season = searchParams.get("season");
  const episode = searchParams.get("episode");

  if (!imdbId || !/^tt\d+$/.test(imdbId)) {
    return NextResponse.json({ torrents: [] });
  }

  try {
    if (type === "movie") {
      const apiBase = ["https://", "yts.mx", "/api/v2/movie_details.json"].join("");
      const res = await fetch(`${apiBase}?imdb_id=${imdbId}`, {
        next: { revalidate: 3600 },
      });

      if (!res.ok) return NextResponse.json({ torrents: [] });

      const json = await res.json();
      const rawTorrents = json?.data?.movie?.torrents ?? [];

      const torrents: TorrentOption[] = rawTorrents.map((t: any) => ({
        quality: t.quality || "HD",
        type: (t.type || "web").toUpperCase(),
        size: t.size || "Unknown",
        seeds: Number(t.seeds) || 0,
        magnet: buildMagnet(t.hash, `${title} [${t.quality}]`),
        torrentUrl: t.url || undefined,
      }));

      return NextResponse.json({ torrents });
    }

    if (type === "tv" && season && episode) {
      const numericImdb = imdbId.replace(/^tt/, "");
      const eztvBase = ["https://", "eztvx.to", "/api/get-torrents"].join("");
      const res = await fetch(`${eztvBase}?imdb_id=${numericImdb}&limit=100`, {
        next: { revalidate: 3600 },
      });

      if (!res.ok) return NextResponse.json({ torrents: [] });

      const json = await res.json();
      const allTorrents = json?.torrents ?? [];

      const matching = allTorrents.filter(
        (t: any) => String(t.season) === String(season) && String(t.episode) === String(episode)
      );

      const torrents: TorrentOption[] = matching.slice(0, 8).map((t: any) => {
        const sizeBytes = Number(t.size_bytes) || 0;
        const sizeMb = sizeBytes > 0 ? `${(sizeBytes / (1024 * 1024)).toFixed(0)} MB` : "Unknown";
        const qualityMatch = String(t.title || "").match(/(2160p|1080p|720p|480p)/i);
        return {
          quality: qualityMatch ? qualityMatch[1] : "HDTV",
          type: "MP4 / MKV",
          size: sizeMb,
          seeds: Number(t.seeds) || 0,
          magnet: t.magnet_url || buildMagnet(t.hash, t.title || title),
          torrentUrl: t.torrent_url || undefined,
        };
      });

      return NextResponse.json({ torrents });
    }

    return NextResponse.json({ torrents: [] });
  } catch {
    return NextResponse.json({ torrents: [] });
  }
}
