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
      }),
      invalidatesTags: ["Favorites"],
      async onQueryStarted(item, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          accountApiSlice.util.updateQueryData("getFavorites", undefined, (draft) => {
            if (!Array.isArray(draft)) return;
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
      }),
      invalidatesTags: ["Favorites"],
      async onQueryStarted(item, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          accountApiSlice.util.updateQueryData("getFavorites", undefined, (draft) => {
            if (!Array.isArray(draft)) return;
            const idx = draft.findIndex(
              (fav) =>
                String(fav.tmdbId ?? fav.id) === String(item.tmdbId ?? item.id) &&
                (fav.mediaType ?? "") === (item.mediaType ?? "")
            );
            if (idx !== -1) draft.splice(idx, 1);
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
      }),
      invalidatesTags: ["Watchlist"],
      async onQueryStarted(item, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          accountApiSlice.util.updateQueryData("getWatchlist", undefined, (draft) => {
            if (!Array.isArray(draft)) return;
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
      }),
      invalidatesTags: ["Watchlist"],
      async onQueryStarted(item, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          accountApiSlice.util.updateQueryData("getWatchlist", undefined, (draft) => {
            if (!Array.isArray(draft)) return;
            const idx = draft.findIndex(
              (w) =>
                String(w.tmdbId ?? w.id) === String(item.tmdbId ?? item.id) &&
                (w.mediaType ?? "") === (item.mediaType ?? "")
            );
            if (idx !== -1) draft.splice(idx, 1);
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