import { apiSlice } from "./apiSlice";
import { TV_URL } from "../constants";

export const tvApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🌍 TMDb Public Queries
    getTMDbTVList: builder.query({
      query: (type) => `${TV_URL}/tmdb/list/${type}`, // e.g., popular, top_rated
    }),
    getTMDbTVDetails: builder.query({
      query: (tmdbId) => `${TV_URL}/tmdb/details/${tmdbId}`,
    }),
    getTMDbTVCredits: builder.query({
      query: (tmdbId) => `${TV_URL}/tmdb/credits/${tmdbId}`,
    }),
    getTMDbTVRecommendations: builder.query({
      query: (tmdbId) => `${TV_URL}/tmdb/recommendations/${tmdbId}`,
    }),
    getTMDbTVContentRatings: builder.query({
      query: (tmdbId) => `${TV_URL}/tmdb/content-ratings/${tmdbId}`,
    }),

    // ⭐ Local Review Mutations & Queries
    addTVReview: builder.mutation({
      query: ({ tmdbId, rating, comment }) => ({
        url: `${TV_URL}/tmdb/${tmdbId}/reviews`,
        method: "POST",
        body: { rating, comment },
      }),
    }),
    getTVReviews: builder.query({
      query: (tmdbId) => `${TV_URL}/tmdb/${tmdbId}/reviews`,
    }),
    getTVRating: builder.query({
      query: (tmdbId) => `${TV_URL}/tmdb/${tmdbId}/rating`,
    }),
    deleteTVComment: builder.mutation({
      query: ({ tvId, reviewId }) => ({
        url: `${TV_URL}/tmdb/reviews/delete`,
        method: "DELETE",
        body: { tvId, reviewId },
      }),
    }),
  }),
});

export const {
  useGetTMDbTVListQuery,
  useGetTMDbTVDetailsQuery,
  useGetTMDbTVCreditsQuery,
  useGetTMDbTVRecommendationsQuery,
  useGetTMDbTVContentRatingsQuery,
  useAddTVReviewMutation,
  useGetTVReviewsQuery,
  useGetTVRatingQuery,
  useDeleteTVCommentMutation,
} = tvApiSlice;
