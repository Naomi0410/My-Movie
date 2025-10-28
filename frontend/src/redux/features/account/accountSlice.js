import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  favorites: [],
  watchlist: [],
  loading: false,
  error: null,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setFavorites: (state, action) => {
      state.favorites = action.payload;
    },
    setWatchlist: (state, action) => {
      state.watchlist = action.payload;
    },
    setAccountLoading: (state, action) => {
      state.loading = action.payload;
    },
    setAccountError: (state, action) => {
      state.error = action.payload;
    },
    resetAccount: () => initialState,
  },
});

export const {
  setFavorites,
  setWatchlist,
  setAccountLoading,
  setAccountError,
  resetAccount,
} = accountSlice.actions;

export default accountSlice.reducer;
