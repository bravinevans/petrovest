import GenresSelect from "@/components/ui/input/GenresSelect";
import useDiscoverFilters from "@/hooks/useDiscoverFilters";
import { DiscoverMoviesFetchQueryType } from "@/types/movie";
import { Select, SelectItem } from "@heroui/react";

const POOLS = [
  { key: "all", label: "All" },
  { key: "movies", label: "Movies" },
  { key: "tv", label: "TV Shows" },
  { key: "animation", label: "Animation & Cartoons" },
  { key: "anime", label: "Anime" },
] as const;

const DiscoverFilters = () => {
  const {
    types,
    content,
    genres,
    queryType,
    pool,
    setPool,
    setQueryType,
    setGenres,
    resetFilters,
  } = useDiscoverFilters();
  const supportsContentSpecificFilters = pool === "movies" || pool === "tv";

  return (
    <section aria-label="Discover filters" className="flex w-full flex-col items-center gap-5">
      <nav
        aria-label="Content pools"
        className="flex w-full flex-wrap justify-center border-b border-zinc-800"
      >
        {POOLS.map(({ key, label }) => {
          const active = pool === key;

          return (
            <button
              key={key}
              type="button"
              aria-pressed={active}
              onClick={() => setPool(key)}
              className={`-mb-px min-h-11 border-b-2 px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-300 ${
                active
                  ? "border-b-zinc-100 bg-zinc-950 text-zinc-100"
                  : "border-b-transparent bg-transparent text-zinc-400 hover:border-b-zinc-600 hover:text-zinc-200"
              }`}
            >
              {label}
            </button>
          );
        })}
      </nav>

      <div className="flex w-full flex-wrap items-center justify-center gap-3">
        {supportsContentSpecificFilters && (
          <>
            <Select
              disallowEmptySelection
              selectionMode="single"
              size="sm"
              label="Type"
              placeholder="Select type"
              className="max-w-xs"
              selectedKeys={[queryType]}
              onChange={({ target }) => {
                setQueryType(target.value as DiscoverMoviesFetchQueryType);
                setGenres(null);
              }}
              value={queryType}
            >
              {types.map(({ name, key }) => (
                <SelectItem key={key}>{name}</SelectItem>
              ))}
            </Select>

            <GenresSelect
              type={content}
              selectedKeys={genres}
              onGenreChange={(nextGenres) => {
                setGenres(nextGenres);
                setQueryType("discover");
              }}
            />
          </>
        )}

        <button
          type="button"
          onClick={resetFilters}
          className="min-h-10 border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-300"
        >
          Reset Filters
        </button>
      </div>
    </section>
  );
};

export default DiscoverFilters;
