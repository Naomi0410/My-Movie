import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filters: {
    searchTerm: "",
    genreId: "",       // TMDb uses genre IDs for TV genres too
    year: "",
    sortBy: "",        // e.g. 'popularity.desc', 'first_air_date.desc'
  },
  tvShows: [],
  totalPages: 1,
  currentPage: 1,
  loading: false,
};

const tvSlice = createSlice({
  name: "tv",
  initialState,
  reducers: {
    setTvFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setTvShows: (state, action) => {
      state.tvShows = action.payload.results;
      state.totalPages = action.payload.total_pages;
      state.currentPage = action.payload.page;
    },
    setTvLoading: (state, action) => {
      state.loading = action.payload;
    },
    resetTvFilters: (state) => {
      state.filters = {
        searchTerm: "",
        genreId: "",
        year: "",
        sortBy: "",
      };
    },
  },
});

export const {
  setTvFilters,
  setTvShows,
  setTvLoading,
  resetTvFilters,
} = tvSlice.actions;

export default tvSlice.reducer;
