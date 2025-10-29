import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../constants";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🔐 Local Auth
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: data, 
      }),
    }),

    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: "POST",
        body: data,
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
      }),
    }),

    getProfile: builder.query({
      query: () => ({
        url: `${USERS_URL}/profile`,
        method: "GET",
      }),
    }),

    deleteAccount: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/profile`,
        method: "DELETE",
      }),
    }),

    getUsers: builder.query({
      query: () => ({
        url: USERS_URL,
        method: "GET",
      }),
    }),

    // 🎬 TMDb Auth
    createGuestSession: builder.query({
      query: () => ({
        url: `${USERS_URL}/tmdb/guest-session`,
        method: "GET",
      }),
    }),

    createRequestToken: builder.query({
      query: () => ({
        url: `${USERS_URL}/tmdb/request-token`,
        method: "GET",
      }),
    }),

    validateTokenWithLogin: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/tmdb/validate-login`,
        method: "POST",
        body: data,
      }),
    }),

    createSession: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/tmdb/create-session`,
        method: "POST",
        body: data,
      }),
    }),

    deleteSession: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/tmdb/delete-session`,
        method: "DELETE",
        body: data,
      }),
    }),
  }),
});


export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useUpdateProfileMutation,
  useGetProfileQuery,
  useDeleteAccountMutation,
  useGetUsersQuery,
  useCreateGuestSessionQuery,
  useCreateRequestTokenQuery,
  useValidateTokenWithLoginMutation,
  useCreateSessionMutation,
  useDeleteSessionMutation,
} = userApiSlice;
