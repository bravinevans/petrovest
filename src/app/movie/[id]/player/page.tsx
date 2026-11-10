import { tmdb } from "@/api/tmdb-client";
import { getMovieLastPosition } from "@/actions/histories";
import MoviePlayer from "@/components/sections/Movie/Player/Player";
import { Params } from "@/types";
import { isEmpty } from "@/utils/helpers";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MoviePlayerPage({ params }: PageProps) {
  // Safe asynchronous parsing for parameters mandated by Next.js App Router rules
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);

  if (isNaN(id)) return notFound();

  try {
    // Run both data requests in parallel on the server node for maximum velocity
    const [movie, startAt] = await Promise.all([
      tmdb.movies.details(id),
      getMovieLastPosition(id).catch(() => 0) // Graceful fallback if no history exists
    ]);

    if (isEmpty(movie)) return notFound();

    // Deliver perfectly hydrated data down to your client player component cleanly
    return <MoviePlayer movie={movie} startAt={startAt ?? 0} />;
  } catch (error) {
    console.error("Server-side streaming data hydration failure:", error);
    return notFound();
  }
}
