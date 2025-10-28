import { GENRE_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const genreApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMovieGenres: builder.query({
      query: () => ({
        url: `${GENRE_URL}/movie`,
      }),
    }),
    getTVGenres: builder.query({
      query: () => ({
        url: `${GENRE_URL}/tv`,
      }),
    }),
  }),
});

export const {
  useGetMovieGenresQuery,
  useGetTVGenresQuery,
} = genreApiSlice;
