import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  favorites: [],
  watchlist: [],
  loading: false,
  error: null,
  optimisticRollback: null, // for tracking rollback targets
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    // 🔄 Full list setters
    setFavorites: (state, action) => {
      state.favorites = action.payload;
    },
    setWatchlist: (state, action) => {
      state.watchlist = action.payload;
    },

    // ➕ Item-level updates
    addFavorite: (state, action) => {
      state.favorites.push(action.payload);
    },
    removeFavorite: (state, action) => {
      state.favorites = state.favorites.filter(
        (item) => item.id !== action.payload.id
      );
    },
    addToWatchlist: (state, action) => {
      state.watchlist.push(action.payload);
    },
    removeFromWatchlist: (state, action) => {
      state.watchlist = state.watchlist.filter(
        (item) => item.id !== action.payload.id
      );
    },

    // ⚙️ UI state
    setAccountLoading: (state, action) => {
      state.loading = action.payload;
    },
    setAccountError: (state, action) => {
      state.error = action.payload;
    },

    // 🔁 Rollback support
    setOptimisticRollback: (state, action) => {
      state.optimisticRollback = action.payload;
    },
    clearOptimisticRollback: (state) => {
      state.optimisticRollback = null;
    },

    // 🧹 Reset
    resetAccount: () => initialState,
  },
});

export const {
  setFavorites,
  setWatchlist,
  addFavorite,
  removeFavorite,
  addToWatchlist,
  removeFromWatchlist,
  setAccountLoading,
  setAccountError,
  setOptimisticRollback,
  clearOptimisticRollback,
  resetAccount,
} = accountSlice.actions;

export default accountSlice.reducer;
