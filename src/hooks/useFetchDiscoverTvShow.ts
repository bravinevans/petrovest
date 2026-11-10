"use client";

import { tmdb } from "@/api/tmdb-client";
import { DiscoverTvShowsFetchQueryType } from "@/types/movie";
import { TvShowDiscoverResult } from "tmdb-ts/dist/types/discover";

interface FetchDiscoverTvShows {
  page?: number;
  type?: DiscoverTvShowsFetchQueryType;
  genres?: string;
  originCountry?: string;
}

const useFetchDiscoverTvShows = ({
  page = 1,
  type = "discover",
  genres,
  originCountry,
}: FetchDiscoverTvShows): Promise<TvShowDiscoverResult> => {
  const discover = () =>
    tmdb.discover.tvShow({
      page,
      with_genres: genres,
      with_origin_country: originCountry,
    } as any);

  const todayTrending = () => tmdb.trending.trending("tv", "day", { page });
  const thisWeekTrending = () => tmdb.trending.trending("tv", "week", { page });
  const popular = () => tmdb.tvShows.popular({ page });
  const onTheAir = () => tmdb.tvShows.onTheAir({ page });
  const topRated = () => tmdb.tvShows.topRated({ page });

  const queryData = {
    discover,
    todayTrending,
    thisWeekTrending,
    popular,
    onTheAir,
    topRated,
  }[type];

  // @ts-expect-error: Property 'adult' is missing in type 'PopularTvShowResult' but required in type 'TV'.
  return queryData();
};

export default useFetchDiscoverTvShows;
