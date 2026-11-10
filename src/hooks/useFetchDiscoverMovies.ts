"use client";

import { tmdb } from "@/api/tmdb-client";
import { DiscoverMoviesFetchQueryType } from "@/types/movie";
import { MovieDiscoverResult } from "tmdb-ts/dist/types/discover";

interface FetchDiscoverMovies {
  page?: number;
  type?: DiscoverMoviesFetchQueryType;
  genres?: string;
  originCountry?: string;
}

const useFetchDiscoverMovies = ({
  page = 1,
  type = "discover",
  genres,
  originCountry,
}: FetchDiscoverMovies): Promise<MovieDiscoverResult> => {
  const discover = () =>
    tmdb.discover.movie({
      page,
      with_genres: genres,
      with_origin_country: originCountry,
    } as any);

  const todayTrending = () => tmdb.trending.trending("movie", "day", { page });
  const thisWeekTrending = () => tmdb.trending.trending("movie", "week", { page });
  const popular = () => tmdb.movies.popular({ page });
  const nowPlaying = () => tmdb.movies.nowPlaying({ page });
  const upcoming = () => tmdb.movies.upcoming({ page });
  const topRated = () => tmdb.movies.topRated({ page });

  const queryData = {
    discover,
    todayTrending,
    thisWeekTrending,
    popular,
    nowPlaying,
    upcoming,
    topRated,
  }[type];

  return queryData();
};

export default useFetchDiscoverMovies;
