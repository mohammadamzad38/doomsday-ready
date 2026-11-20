import { useEffect, useState } from "react";
import { getMovies } from "../services/movies.api";
import type { Movie } from "../types/movie.types";
import MovieForm from "../components/movieForm";

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMovies();

      setMovies(data);
    } catch (error: any) {
      console.error("Fetch movies error:", error);

      setError(error.response?.data?.message || "Failed to load movies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <main className="mx-auto max-w-4xl space-y-8 p-6">
      <h1 className="text-3xl font-bold">Doomsday Ready</h1>

      <section className="rounded-lg border p-5">
        <h2 className="mb-4 text-xl font-semibold">Add New Movie</h2>

        <MovieForm onMovieCreated={fetchMovies} />
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Movies</h2>

        {loading && <p>Loading movies...</p>}

        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && movies.length === 0 && <p>No movies found.</p>}

        <div className="space-y-3">
          {movies.map((movie) => (
            <div key={movie._id} className="rounded-lg border p-4">
              <h3 className="text-lg font-semibold">{movie.title}</h3>

              <p>Release Year: {movie.releaseYear}</p>
              <p>Runtime: {movie.runtime} minutes</p>

              <p>Status: {movie.watched ? "Watched" : "Not Watched"}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
