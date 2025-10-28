import { apiSlice } from "./apiSlice";
import { SEARCH_URL } from "../constants";

export const searchApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    searchTMDb: builder.query({
      query: ({ query, type }) => ({
        url: `${SEARCH_URL}/tmdb`,
        params: { query, type }, // e.g., query=breaking, type=tv
      }),
    }),
  }),
});

export const {
  useSearchTMDbQuery,
} = searchApiSlice;
