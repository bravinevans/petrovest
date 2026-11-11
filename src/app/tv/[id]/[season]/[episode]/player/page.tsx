"use client";

import { tmdb } from "@/api/tmdb-client";
import { Params } from "@/types";
import { Spinner } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { use } from "react";
import dynamic from "next/dynamic";
import { NextPage } from "next";
import { getTvShowLastPosition } from "@/actions/histories";

const TvShowPlayer = dynamic(() => import("@/components/sections/TV/Player/Player"));

const TvShowPlayerPage: NextPage<Params<{ id: string | number; season: string | number; episode: string | number }>> = ({
  params,
}) => {
  const resolvedParams = use(params);
  const id = Number(resolvedParams.id);
  const season = Number(resolvedParams.season);
  const episode = Number(resolvedParams.episode);

  const isValidParams = !isNaN(id) && !isNaN(season) && !isNaN(episode) && id > 0;

  const {
    data: tv,
    isPending: isPendingTv,
    error: errorTv,
  } = useQuery({
    queryFn: () => tmdb.tvShows.details(id),
    queryKey: ["tv-show-player-details", id],
    enabled: isValidParams,
  });

  const {
    data: seasonDetail,
    isPending: isPendingSeason,
    error: errorSeason,
  } = useQuery({
    queryFn: () => tmdb.tvShows.season(id, season),
    queryKey: ["tv-show-season", id, season],
    enabled: isValidParams,
  });

  const { data: startAt, isPending: isPendingStartAt } = useQuery({
    queryFn: () => getTvShowLastPosition(id, season, episode),
    queryKey: ["tv-show-player-start-at", id, season, episode],
    staleTime: 0,
    enabled: isValidParams,
  });

  if (!isValidParams) return notFound();

  if (isPendingTv || isPendingSeason || isPendingStartAt) {
    return <Spinner size="lg" className="absolute-center" color="warning" variant="simple" />;
  }

  const EPISODE = seasonDetail?.episodes.find(
    (e) => e.episode_number === episode,
  );

  if (!EPISODE || !tv || !seasonDetail || errorTv || errorSeason) return notFound();

  const isNotReleased = EPISODE.air_date ? new Date(EPISODE.air_date) > new Date() : false;

  if (isNotReleased) return notFound();

  const currentEpisodeIndex = seasonDetail.episodes.findIndex(
    (e) => e.episode_number === EPISODE.episode_number,
  );

  const nextEpisodeNumber =
    currentEpisodeIndex < seasonDetail.episodes.length - 1
      ? seasonDetail.episodes[currentEpisodeIndex + 1].air_date &&
        new Date(seasonDetail.episodes[currentEpisodeIndex + 1].air_date) > new Date()
        ? null
        : seasonDetail.episodes[currentEpisodeIndex + 1].episode_number
      : null;

  const prevEpisodeNumber =
    currentEpisodeIndex > 0 ? seasonDetail.episodes[currentEpisodeIndex - 1].episode_number : null;

  return (
    <TvShowPlayer
      tv={tv}
      id={id}
      seriesName={tv.name}
      seasonName={seasonDetail.name}
      episode={EPISODE}
      episodes={seasonDetail.episodes}
      nextEpisodeNumber={nextEpisodeNumber}
      prevEpisodeNumber={prevEpisodeNumber}
      startAt={startAt}
    />
  );
};

export default TvShowPlayerPage;
