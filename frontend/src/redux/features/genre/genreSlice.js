import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  movieGenres: [],
  tvGenres: [],
  loading: false,
  error: null,
};

const genreSlice = createSlice({
  name: "genre",
  initialState,
  reducers: {
    setMovieGenres: (state, action) => {
      state.movieGenres = action.payload;
      state.error = null;
    },
    setTVGenres: (state, action) => {
      state.tvGenres = action.payload;
      state.error = null;
    },
    setGenreLoading: (state, action) => {
      state.loading = action.payload;
    },
    setGenreError: (state, action) => {
      state.error = action.payload;
    },
    resetGenres: (state) => {
      state.movieGenres = [];
      state.tvGenres = [];
      state.error = null;
      state.loading = false;
    },
  },
});

export const {
  setMovieGenres,
  setTVGenres,
  setGenreLoading,
  setGenreError,
  resetGenres,
} = genreSlice.actions;

export default genreSlice.reducer;
