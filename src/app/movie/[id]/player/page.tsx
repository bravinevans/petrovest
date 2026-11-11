"use client";

import { tmdb } from "@/api/tmdb-client";
import { getMovieLastPosition } from "@/actions/histories";
import MoviePlayer from "@/components/sections/Movie/Player/Player";
import { Params } from "@/types";
import { isEmpty } from "@/utils/helpers";
import { Spinner } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { NextPage } from "next";
import { notFound } from "next/navigation";
import { use } from "react";

const MoviePlayerPage: NextPage<Params<{ id: string | number }>> = ({ params }) => {
  const resolvedParams = use(params);
  const id = Number(resolvedParams.id);

  if (!id || isNaN(id)) return notFound();

  const {
    data: movie,
    isPending,
    error,
  } = useQuery({
    queryFn: () => tmdb.movies.details(id),
    queryKey: ["movie-player-detail", id],
    enabled: Boolean(id && !isNaN(id)),
  });

  const { data: startAt, isPending: isPendingStartAt } = useQuery({
    queryFn: () => getMovieLastPosition(id),
    queryKey: ["movie-player-start-at", id],
    staleTime: 0,
    enabled: Boolean(id && !isNaN(id)),
  });

  if (isPending || isPendingStartAt) {
    return <Spinner size="lg" className="absolute-center" variant="simple" />;
  }

  if (error || isEmpty(movie)) return notFound();

  return <MoviePlayer movie={movie} startAt={startAt} />;
};

export default MoviePlayerPage;
