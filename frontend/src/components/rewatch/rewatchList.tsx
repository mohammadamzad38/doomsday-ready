import type { Movie } from "../../types/movie.types";

interface RewatchListProps {
  movies: Movie[];
}

export default function RewatchList({ movies }: RewatchListProps) {
  if (movies.length === 0) {
    return (
      <div className="rounded-xl border p-6 text-center">
        <p>No prerequisite movies found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {movies.map((movie, index) => (
        <div
          key={movie._id}
          className="flex items-center gap-4 rounded-xl border p-4"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
            {index + 1}
          </span>

          <div className="flex-1">
            <h3 className="font-semibold">{movie.title}</h3>

            <p className="text-sm text-gray-500">
              {movie.releaseYear} · {movie.runtime} minutes
            </p>
          </div>

          <span
            className={
              movie.watched
                ? "text-sm font-medium text-green-600"
                : "text-sm font-medium text-orange-500"
            }
          >
            {movie.watched ? "Watched" : "Not Watched"}
          </span>
        </div>
      ))}
    </div>
  );
}
