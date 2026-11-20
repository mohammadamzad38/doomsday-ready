import api from "../api/axios";
import type {
  Movie,
  CreateMoviePayload,
  RewatchPlan,
} from "../types/movie.types";

export const getMovies = async (): Promise<Movie[]> => {
  const response = await api.get<Movie[]>("/movies");

  return response.data;
};

export const createMovie = async (
  movieData: CreateMoviePayload,
): Promise<Movie> => {
  const response = await api.post<Movie>("/movies", movieData);

  return response.data;
};

export const getRewatchOrder = async (
  movieId: string,
): Promise<RewatchPlan> => {
  const response = await api.get<RewatchPlan>(
    `/movies/${movieId}/rewatch-order`,
  );

  return response.data;
};

