interface RewatchProgressProps {
  watchedCount: number;
  totalMovies: number;
  remainingRuntime: number;
}

export default function RewatchProgress({
  watchedCount,
  totalMovies,
  remainingRuntime,
}: RewatchProgressProps) {
  const progress =
    totalMovies > 0 ? Math.round((watchedCount / totalMovies) * 100) : 0;

  const hours = Math.floor(remainingRuntime / 60);
  const minutes = remainingRuntime % 60;

  return (
    <div className="rounded-xl border p-5 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-lg">Rewatch Progress</h2>

        <span className="font-semibold text-green-600">{progress}%</span>
      </div>

      <div className="h-3 rounded-full bg-gray-200 overflow-hidden">
        <div
          className="h-full bg-green-600 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-sm text-gray-600">
        {watchedCount} of {totalMovies} movies watched
      </p>

      <div>
        <p className="text-sm text-gray-500">Remaining watch time</p>

        <p className="text-2xl font-bold">
          {hours}h {minutes}m
        </p>
      </div>
    </div>
  );
}
