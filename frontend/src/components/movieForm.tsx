import { useState, type FormEvent } from "react";
import { createMovie } from "../services/movies.api";

interface MovieFormProps {
  onMovieCreated: () => void;
}

export default function MovieForm({ onMovieCreated }: MovieFormProps) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [runtime, setRuntime] = useState("");
  const [loading, setLoading] = useState(false);
  const [releaseYear, setReleaseYear] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await createMovie({
        title,
        releaseYear: Number(releaseYear),
        runtime: Number(runtime),
      });

      setTitle("");
      setReleaseYear("");
      setRuntime("");

      onMovieCreated();
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to create movie");
    } finally {
      setLoading(false);
    }
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

      {error && <p className="text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded bg-blue-600 px-5 py-2 text-white disabled:opacity-50"
      >
        {loading ? "Creating..." : "Add Movie"}
      </button>
    </form>
  );
}
