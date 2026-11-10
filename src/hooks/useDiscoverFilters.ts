import { queryClient as q } from "@/app/providers";
import { siteConfig } from "@/config/site";
import { DISCOVER_MOVIES_VALID_QUERY_TYPES, DISCOVER_TVS_VALID_QUERY_TYPES } from "@/types/movie";
import { parseAsSet } from "@/utils/parsers";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { useCallback, useEffect, useMemo } from "react";

const VALID_CONTENT_TYPES = ["movie", "tv"] as const;
const DEFAULT_QUERY_TYPE = "discover";
const ANIMATION_GENRE_ID = "16";
const DISCOVER_POOLS = ["all", "movies", "tv", "animation", "anime"] as const;
type DiscoverPool = (typeof DISCOVER_POOLS)[number];

const useDiscoverFilters = () => {
  const { movies, tvShows } = siteConfig.queryLists;

  const [genres, setGenres] = useQueryState("genres", parseAsSet.withDefault(new Set<string>()));
  const [queryType, setQueryType] = useQueryState(
    "type",
    parseAsStringLiteral([
      ...DISCOVER_MOVIES_VALID_QUERY_TYPES,
      ...DISCOVER_TVS_VALID_QUERY_TYPES,
    ]).withDefault(DEFAULT_QUERY_TYPE),
  );
  const [content, setContent] = useQueryState(
    "content",
    parseAsStringLiteral(VALID_CONTENT_TYPES).withDefault("movie"),
  );
  const [pool, setPoolState] = useQueryState(
    "pool",
    parseAsStringLiteral(DISCOVER_POOLS).withDefault("all"),
  );

  const types = useMemo(
    () => [
      { name: "Discover", key: DEFAULT_QUERY_TYPE },
      ...(content === "movie" ? movies : tvShows).map(({ name, param }) => ({
        name: name.replace(/(Movies|TV Shows)/g, "").trim(),
        key: param,
      })),
    ],
    [content, movies, tvShows],
  );

  const genresString = useMemo(() => {
    const selectedGenres = Array.from(genres).filter((genre) => genre !== "");

    if (pool === "animation" || pool === "anime") {
      selectedGenres.push(ANIMATION_GENRE_ID);
    }

    return Array.from(new Set(selectedGenres)).join(",");
  }, [genres, pool]);

  const originCountry = pool === "anime" ? "JP" : undefined;

  const setPool = useCallback(
    (nextPool: DiscoverPool) => {
      setPoolState(nextPool);
      setGenres(null);
      setQueryType(DEFAULT_QUERY_TYPE);

      if (nextPool === "movies") {
        setContent("movie");
      }

      if (nextPool === "tv") {
        setContent("tv");
      }
    },
    [setContent, setGenres, setPoolState, setQueryType],
  );

  const resetFilters = useCallback(() => {
    setGenres(null);
    setQueryType(DEFAULT_QUERY_TYPE);
    setPoolState("all");
  }, [setGenres, setPoolState, setQueryType]);

  const clearQueries = useCallback(() => {
    const queryKeys = ["discover-movies", "discover-tv-shows"];
    queryKeys.forEach((key) => {
      if (!q.isFetching({ queryKey: [key] })) {
        q.removeQueries({ queryKey: [key] });
      }
    });
  }, []);

  useEffect(() => {
    clearQueries();
  }, [content, queryType, genresString, originCountry, clearQueries]);

  return {
    types,
    genres,
    queryType,
    content,
    pool,
    genresString,
    originCountry,
    setGenres,
    setQueryType,
    setContent,
    setPool,
    resetFilters,
  };
};

export default useDiscoverFilters;
