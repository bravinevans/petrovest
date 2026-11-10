"use client";

import MovieDiscoverList from "./MovieList";
import useDiscoverFilters from "@/hooks/useDiscoverFilters";
import DiscoverFilters from "./Filters";
import TvShowDiscoverList from "./TvShowList";

const DiscoverListGroup = () => {
  const { pool } = useDiscoverFilters();
  const showMovies = pool === "all" || pool === "movies" || pool === "animation" || pool === "anime";
  const showTv = pool === "all" || pool === "tv" || pool === "animation" || pool === "anime";

  return (
    <div className="flex flex-col gap-10">
      <DiscoverFilters />
      {showMovies && <MovieDiscoverList />}
      {showTv && <TvShowDiscoverList />}
    </div>
  );
};

export default DiscoverListGroup;
