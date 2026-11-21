import { useEffect, useState } from "react";
import { getMovies, updateMovie } from "../services/movies.api";
import type { Movie } from "../types/movie.types";
import MovieForm from "../components/movieForm";

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingMovieId, setEditingMovieId] = useState<string | null>(null);
  const [selectedPrerequisites, setSelectedPrerequisites] = useState<string[]>(
    [],
  );
  const [saving, setSaving] = useState(false);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMovies();
      setMovies(data);
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to load movies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const startEditing = (movie: Movie) => {
    setEditingMovieId(movie._id);
    setSelectedPrerequisites(movie.prerequisites.map(String));
  };

  const togglePrerequisite = (movieId: string) => {
    setSelectedPrerequisites((previous) =>
      previous.includes(movieId)
        ? previous.filter((id) => id !== movieId)
        : [...previous, movieId],
    );
  };

  const savePrerequisites = async (movieId: string) => {
    try {
      setSaving(true);
      setError("");

      await updateMovie(movieId, {
        prerequisites: selectedPrerequisites,
      });

      setEditingMovieId(null);
      setSelectedPrerequisites([]);

      await fetchMovies();
    } catch (error: any) {
      setError(
        error.response?.data?.message || "Failed to update prerequisites",
      );
    } finally {
      setSaving(false);
    }
  };

  const cancelEditing = () => {
    setEditingMovieId(null);
    setSelectedPrerequisites([]);
  };

  const handleWatchedToggle = async (movie: Movie) => {
    try {
      setError("");

      await updateMovie(movie._id, {
        watched: !movie.watched,
      });

      await fetchMovies();
    } catch (error: any) {
      setError(
        error.response?.data?.message || "Failed to update movie status",
      );
    }
  };

  return (
    <main className="mx-auto max-w-4xl space-y-8 p-6">
      <h1 className="text-3xl font-bold">Doomsday Ready</h1>

      <section className="rounded-lg border p-5">
        <h2 className="mb-4 text-xl font-semibold">Add New Movie</h2>

        <MovieForm movies={movies} onMovieCreated={fetchMovies} />
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Movies</h2>

        {loading && <p>Loading movies...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && movies.length === 0 && <p>No movies found.</p>}

        <div className="space-y-3">
          {movies.map((movie) => (
            <div key={movie._id} className="rounded-lg border p-4">
              <h3 className="text-lg font-semibold">{movie.title}</h3>

              <p>Release Year: {movie.releaseYear}</p>
              <p>Runtime: {movie.runtime} minutes</p>
              <div className="mt-3 flex items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ${
                    movie.watched
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {movie.watched ? "Watched" : "Not Watched"}
                </span>

                <button
                  type="button"
                  onClick={() => handleWatchedToggle(movie)}
                  className={`rounded  px-4 cursor-pointer py-2 text-sm text-white ${
                    movie.watched ? "bg-gray-600" : "bg-green-600"
                  }`}
                >
                  {movie.watched ? "Mark as Unwatched" : "Mark as Watched"}
                </button>
              </div>
              {editingMovieId === movie._id ? (
                <div className="mt-4 space-y-3">
                  <p className="font-medium">Edit Prerequisite Movies</p>

                  {movies
                    .filter((item) => item._id !== movie._id)
                    .map((item) => (
                      <label key={item._id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedPrerequisites.includes(item._id)}
                          onChange={() => togglePrerequisite(item._id)}
                        />
                        {item.title}
                      </label>
                    ))}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => savePrerequisites(movie._id)}
                      className="rounded cursor-pointer bg-green-600 px-4 py-2 text-white disabled:opacity-50"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>

                    <button
                      type="button"
                      disabled={saving}
                      onClick={cancelEditing}
                      className="rounded cursor-pointer border px-4 py-2"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => startEditing(movie)}
                  className="mt-3 cursor-pointer rounded bg-blue-600 px-4 py-2 text-white"
                >
                  Edit Prerequisites
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
