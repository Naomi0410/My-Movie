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
      async onQueryStarted(item, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          accountApiSlice.util.updateQueryData("getFavorites", undefined, (draft) => {
            draft.push(item);
          })
        );
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Failed to add to favorites:", error);
          patchResult.undo();
        }
      },
    }),

    removeFromFavorites: builder.mutation({
      query: (item) => ({
        url: `${ACCOUNT_URL}/favorites`,
        method: "DELETE",
        body: item,
        credentials: "include",
      }),
      invalidatesTags: ["Favorites"],
      async onQueryStarted(item, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          accountApiSlice.util.updateQueryData("getFavorites", undefined, (draft) => {
            return draft.filter((fav) => fav.id !== item.id);
          })
        );
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Failed to remove from favorites:", error);
          patchResult.undo();
        }
      },
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
      async onQueryStarted(item, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          accountApiSlice.util.updateQueryData("getWatchlist", undefined, (draft) => {
            draft.push(item);
          })
        );
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Failed to add to watchlist:", error);
          patchResult.undo();
        }
      },
    }),

    removeFromWatchlist: builder.mutation({
      query: (item) => ({
        url: `${ACCOUNT_URL}/watchlist`,
        method: "DELETE",
        body: item,
        credentials: "include",
      }),
      invalidatesTags: ["Watchlist"],
      async onQueryStarted(item, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          accountApiSlice.util.updateQueryData("getWatchlist", undefined, (draft) => {
            return draft.filter((w) => w.id !== item.id);
          })
        );
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Failed to remove from watchlist:", error);
          patchResult.undo();
        }
      },
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
