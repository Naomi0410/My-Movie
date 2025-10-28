import { apiSlice } from "./apiSlice";
import { ACCOUNT_URL } from "../constants";

export const accountApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ⭐ Favorites
    addToFavorites: builder.mutation({
      query: (item) => ({
        url: `${ACCOUNT_URL}/favorites`,
        method: "POST",
        body: item,
        credentials: "include",
      }),
      invalidatesTags: ["Favorites"],
    }),
    removeFromFavorites: builder.mutation({
      query: (item) => ({
        url: `${ACCOUNT_URL}/favorites`,
        method: "DELETE",
        body: item,
        credentials: "include",
      }),
      invalidatesTags: ["Favorites"],
    }),
    getFavorites: builder.query({
      query: () => ({
        url: `${ACCOUNT_URL}/favorites`,
        credentials: "include",
      }),
      providesTags: ["Favorites"],
      refetchOnMountOrArgChange: true,
    }),

    // 📺 Watchlist
    addToWatchlist: builder.mutation({
      query: (item) => ({
        url: `${ACCOUNT_URL}/watchlist`,
        method: "POST",
        body: item,
        credentials: "include",
      }),
      invalidatesTags: ["Watchlist"],
    }),
    removeFromWatchlist: builder.mutation({
      query: (item) => ({
        url: `${ACCOUNT_URL}/watchlist`,
        method: "DELETE",
        body: item,
        credentials: "include",
      }),
      invalidatesTags: ["Watchlist"],
    }),
    getWatchlist: builder.query({
      query: () => ({
        url: `${ACCOUNT_URL}/watchlist`,
        credentials: "include",
      }),
      providesTags: ["Watchlist"],
      refetchOnMountOrArgChange: true,
    }),
  }),
});

export const {
  useAddToFavoritesMutation,
  useRemoveFromFavoritesMutation,
  useGetFavoritesQuery,
  useAddToWatchlistMutation,
  useRemoveFromWatchlistMutation,
  useGetWatchlistQuery,
} = accountApiSlice;
