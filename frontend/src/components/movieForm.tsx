import { useState, type FormEvent } from "react";
import { createMovie } from "../services/movies.api";
import type { Movie } from "../types/movie.types";

interface MovieFormProps {
  movies: Movie[];
  onMovieCreated: () => void;
}

export default function MovieForm({ movies, onMovieCreated }: MovieFormProps) {
  const [title, setTitle] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [runtime, setRuntime] = useState("");
  const [prerequisites, setPrerequisites] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await createMovie({
        title,
        releaseYear: Number(releaseYear),
        runtime: Number(runtime),
        prerequisites,
      });

      setTitle("");
      setReleaseYear("");
      setRuntime("");
      setPrerequisites([]);

      onMovieCreated();
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to create movie");
    } finally {
      setLoading(false);
    }
  };

  const handlePrerequisiteChange = (movieId: string) => {
    setPrerequisites((previous) =>
      previous.includes(movieId)
        ? previous.filter((id) => id !== movieId)
        : [...previous, movieId],
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Movie title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full rounded border p-3"
      />

      <input
        type="number"
        placeholder="Release year"
        value={releaseYear}
        onChange={(e) => setReleaseYear(e.target.value)}
        required
        min="1"
        className="w-full rounded border p-3"
      />

      <input
        type="number"
        placeholder="Runtime in minutes"
        value={runtime}
        onChange={(e) => setRuntime(e.target.value)}
        required
        min="1"
        max="300"
        className="w-full rounded border p-3"
      />

      <div className="space-y-2">
        <label className="font-medium">Prerequisite Movies (Optional)</label>

        {movies.length === 0 ? (
          <p className="text-sm text-gray-500">No existing movies available.</p>
        ) : (
          <div className="max-h-48 space-y-2 overflow-y-auto rounded border p-3">
            {movies.map((movie) => (
              <label
                key={movie._id}
                className="flex cursor-pointer items-center gap-2"
              >
                <input
                  type="checkbox"
                  checked={prerequisites.includes(movie._id)}
                  onChange={() => handlePrerequisiteChange(movie._id)}
                />

                <span>{movie.title}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded cursor-pointer bg-blue-600 px-5 py-2 text-white disabled:opacity-50"
      >
        {loading ? "Creating..." : "Add Movie"}
      </button>
    </form>
  );
}
