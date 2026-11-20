import api from "../api/axios";
import type { Cinema, BookingQuote } from "../types/cinema.types";

export const getCinemas = async (): Promise<Cinema[]> => {
  const response = await api.get<Cinema[]>("/cinemas");

  return response.data;
};

export const getBookingQuote = async (
  cinemaId: string,
  groupsize: number,
): Promise<BookingQuote> => {
  const response = await api.get<BookingQuote>(`/cinemas/${cinemaId}/booking`, {
    params: {
      groupsize,
    },
  });

  return response.data;
};
