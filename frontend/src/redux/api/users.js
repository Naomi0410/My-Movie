import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../constants";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🔐 Local Auth
    refreshAccessToken: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/refresh-token`,
        method: "POST",
      }),
    }),

    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: data,
      }),
      transformResponse: (response) => {
        // Optionally shape the response
        return response;
      },
      onError: (error) => {
        console.error("Login failed:", error);
      },
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
      invalidatesTags: ["User"],
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Profile"],
      async onQueryStarted(data, { dispatch, queryFulfilled }) {
        // Optimistically update the profile cache
        const patchResult = dispatch(
          userApiSlice.util.updateQueryData(
            "getProfile",
            undefined,
            (draft) => {
              Object.assign(draft, data);
            }
          )
        );

        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Failed to update profile:", error);
          patchResult.undo(); // Rollback if mutation fails
        }
      },
    }),

    getProfile: builder.query({
      query: () => ({
        url: `${USERS_URL}/profile`,
        method: "GET",
      }),
      providesTags: ["Profile"],
    }),

    deleteAccount: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/profile`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
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
  useRefreshAccessTokenMutation,
} = userApiSlice;
