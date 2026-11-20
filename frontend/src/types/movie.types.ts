export interface Movie {
  _id: string;
  title: string;
  releaseYear: number;
  runtime: number;
  prerequisites: string[];
  watched: boolean;
}

export interface CreateMoviePayload {
  title: string;
  releaseYear: number;
  runtime: number;
  prerequisites?: string[];
  watched?: boolean;
}

export interface RewatchPlan {
  targetMovie: Movie;
  reWatchOrder: Movie[];
  watchedCount: number;
  totalUnwatchedRuntime: number;
}


