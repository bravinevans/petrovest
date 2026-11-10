"use client";
import { siteConfig } from "@/config/site";
import { usePlayerEvents } from "@/hooks/usePlayerEvents";
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
"allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation-by-user-activation";
const TvShowPlayer: React.FC = ({
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
{ label: "Server 1 (VidLink)", src: https://vidlink.pro{tmdbId}/${season}/${episodeNumber} },
{ label: "Server 2 (VidSrc To)", src: https://vidsrc.to{tmdbId}/${season}/${episodeNumber} },
{ label: "Server 3 (SuperEmbed)", src: https://multiembed.eu{tmdbId}&tmdb=1&s=${season}&e=${episodeNumber} },
{ label: "Server 4 (VidSrc Me)", src: https://vidsrc.me{tmdbId}/${season}/${episodeNumber} },
{ label: "Server 5 (2Embed)", src: https://2embed.cc{tmdbId}&s=${season}&e=${episodeNumber} },
{ label: "Server 6 (AutoEmbed)", src: https://autoembed.cc{tmdbId}/${season}/${episodeNumber} },
{ label: "Server 7 (NonoEmbed)", src: https://nono.id{tmdbId}/${season}/${episodeNumber} },
{ label: "Server 8 (SmashStream)", src: https://smashystream.com{tmdbId}&season=${season}&episode=${episodeNumber} },
{ label: "Server 9 (Flicktstream)", src: https://flicktstream.com{tmdbId}/${season}/${episodeNumber} }
];
usePlayerEvents({ saveHistory: true, metadata: { season, episode: episodeNumber } });
useDocumentTitle(Play ${seriesName} - ${seasonName} - ${episode.name} | ${siteConfig.name});
const activeServer = servers[selectedServer];
const previousHref = prevEpisodeNumber
? /tv/${id}/${season}/${prevEpisodeNumber}/player
: undefined;
const nextHref = nextEpisodeNumber
? /tv/${id}/${season}/${nextEpisodeNumber}/player
: undefined;
return (

Petrovest Streaming


{seriesName}


{seasonName} / Episode {episodeNumber}: {episode.name}

{previousHref ? (
Previous episode
) : (

Previous episode

)}
<button
type="button"
onClick={() => setEpisodeSelectionOpen(true)}
className="border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-300"
>
Episodes

{nextHref ? (
Next episode
) : (

Next episode

)}

<iframe
key={${tmdbId}-${season}-${episodeNumber}-${selectedServer}}
src={activeServer.src}
title={${seriesName} — ${episode.name} — ${activeServer.label}}
allowFullScreen
sandbox={IFRAME_SANDBOX}
referrerPolicy="no-referrer"
className="block size-full"
/>
{servers.map((server, index) => {
const isActive = selectedServer === index;
return (
<button
key={server.label}
type="button"
aria-pressed={isActive}
onClick={() => setSelectedServer(index)}
className={min-h-10 border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-300 ${ isActive ? "border-zinc-100 bg-zinc-100 text-zinc-950" : "border-zinc-700 bg-zinc-950 text-zinc-300 hover:bg-zinc-800 hover:text-white" }}
>
{server.label}

);
})}

<EpisodeSelection
id={id}
opened={episodeSelectionOpen}
onClose={() => setEpisodeSelectionOpen(false)}
episodes={episodes}
/>

);
};
TvShowPlayer.displayName = "TvShowPlayer";
export default TvShowPlayer;
