import { tmdb } from "@/api/tmdb-client";
import { getMovieLastPosition } from "@/actions/histories";
import MoviePlayer from "@/components/sections/Movie/Player/Player";
import { isEmpty } from "@/utils/helpers";
import { notFound } from "next/navigation";

interface PageProps {
  params: { id: string };
}

export default async function MoviePlayerPage({ params }: PageProps) {
  // Await params directly or read synchronously to satisfy all Next.js version parameters
  const resolvedParams = await params;
  const rawId = resolvedParams?.id;
  
  const id = Number(rawId);

  if (!id || isNaN(id)) {
    return notFound();
  }

  try {
    // Execute both data handshakes simultaneously on the server node
    const [movie, startAt] = await Promise.all([
      tmdb.movies.details(id).catch(() => null),
      getMovieLastPosition(id).catch(() => 0)
    ]);

    if (!movie || isEmpty(movie)) {
      return notFound();
    }

    // Pass the clean data directly down to the player layout
    return <MoviePlayer movie={movie} startAt={startAt ?? 0} />;
  } catch (error) {
    console.error("Server-side 404 fallback routing exception:", error);
    return notFound();
  }
}
