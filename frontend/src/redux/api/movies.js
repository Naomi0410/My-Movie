import { apiSlice } from "./apiSlice";
import { MOVIE_URL } from "../constants";

export const moviesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🌍 TMDb Public Queries
    getTMDbMovieList: builder.query({
      query: (type) => `${MOVIE_URL}/tmdb/list/${type}`,
    }),
    getTMDbMovieDetails: builder.query({
      query: (tmdbId) => `${MOVIE_URL}/tmdb/details/${tmdbId}`,
    }),
    getTMDbMovieCredits: builder.query({
      query: (tmdbId) => `${MOVIE_URL}/tmdb/credits/${tmdbId}`,
    }),
    getTMDbRecommendations: builder.query({
      query: (tmdbId) => `${MOVIE_URL}/tmdb/recommendations/${tmdbId}`,
    }),
    getTMDbReleaseDates: builder.query({
      query: (tmdbId) => `${MOVIE_URL}/tmdb/release-dates/${tmdbId}`,
    }),

    // ⭐ Local Review Mutations & Queries
    addMovieReview: builder.mutation({
      query: ({ tmdbId, rating, comment }) => ({
        url: `${MOVIE_URL}/tmdb/${tmdbId}/reviews`,
        method: "POST",
        body: { rating, comment },
      }),
    }),
    getMovieReviews: builder.query({
      query: (tmdbId) => `${MOVIE_URL}/tmdb/${tmdbId}/reviews`,
    }),
    getMovieRating: builder.query({
      query: (tmdbId) => `${MOVIE_URL}/tmdb/${tmdbId}/rating`,
    }),
    deleteComment: builder.mutation({
      query: ({ movieId, reviewId }) => ({
        url: `${MOVIE_URL}/tmdb/reviews/delete`,
        method: "DELETE",
        body: { movieId, reviewId },
      }),
    }),
  }),
});

export const {
  useGetTMDbMovieListQuery,
  useGetTMDbMovieDetailsQuery,
  useGetTMDbMovieCreditsQuery,
  useGetTMDbRecommendationsQuery,
  useGetTMDbReleaseDatesQuery,
  useAddMovieReviewMutation,
  useGetMovieReviewsQuery,
  useGetMovieRatingQuery,
  useDeleteCommentMutation,
} = moviesApiSlice;
