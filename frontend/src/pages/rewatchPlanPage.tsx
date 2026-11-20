import { useEffect, useState } from "react";
import { getMovies, getRewatchOrder } from "../services/movies.api";
import type { Movie, RewatchPlan } from "../types/movie.types";
import RewatchProgress from "../components/rewatch/rewatchProgress";
import RewatchList from "../components/rewatch/rewatchList";

export default function RewatchPlanPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState("");
  const [plan, setPlan] = useState<RewatchPlan | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await getMovies();
        setMovies(data);
      } catch {
        setError("Failed to load movies.");
      }
    };

    fetchMovies();
  }, []);

  const handleGeneratePlan = async () => {
    if (!selectedMovie) {
      setError("Please select a target movie.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setPlan(null);

      const data = await getRewatchOrder(selectedMovie);

      setPlan(data);
    } catch (error: any) {
      setError(
        error.response?.data?.message || "Failed to generate rewatch plan.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-4xl space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold">Rewatch Plan</h1>

        <p className="mt-2 text-gray-500">
          Plan your MCU journey before Avengers: Doomsday.
        </p>
      </div>

      <section className="space-y-4 rounded-xl border p-5">
        <h2 className="text-xl font-semibold">Select Target Movie</h2>

        <select
          value={selectedMovie}
          onChange={(e) => setSelectedMovie(e.target.value)}
          className="w-full rounded-lg border p-3"
        >
          <option value="">Select a movie</option>

          {movies.map((movie) => (
            <option key={movie._id} value={movie._id}>
              {movie.title}
            </option>
          ))}
        </select>

        <button
          onClick={handleGeneratePlan}
          disabled={loading || !selectedMovie}
          className="rounded-lg bg-blue-600 px-5 py-3 text-white disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Rewatch Plan"}
        </button>

        {error && <p className="text-red-500">{error}</p>}
      </section>

      {plan && (
        <section className="space-y-6">
          <div>
            <p className="text-sm text-gray-500">Your target movie</p>

            <h2 className="text-2xl font-bold">{plan.targetMovie.title}</h2>
          </div>

          <RewatchProgress
            watchedCount={plan.watchedCount}
            totalMovies={plan.reWatchOrder.length}
            remainingRuntime={plan.totalUnwatchedRuntime}
          />

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Movies to Watch</h2>

            <RewatchList movies={plan.reWatchOrder} />
          </div>
        </section>
      )}
    </main>
  );
}
