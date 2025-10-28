import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filters: {
    searchTerm: "",
    genreId: "",       // TMDb uses genre IDs, not names
    year: "",
    sortBy: "",        // TMDb supports sort_by like 'popularity.desc'
  },
  movies: [],
  totalPages: 1,
  currentPage: 1,
  loading: false,
};

const moviesSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setMovies: (state, action) => {
      state.movies = action.payload.results;
      state.totalPages = action.payload.total_pages;
      state.currentPage = action.payload.page;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    resetFilters: (state) => {
      state.filters = {
        searchTerm: "",
        genreId: "",
        year: "",
        sortBy: "",
      };
    },
  },
});

export const { setFilters, setMovies, setLoading, resetFilters } = moviesSlice.actions;
export default moviesSlice.reducer;
