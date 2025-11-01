import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../constants";
import { setCredentials } from "../features/auth/authSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🔐 Local Auth
    refreshAccessToken: builder.mutation({
      query: (refreshToken) => ({
        url: `${USERS_URL}/refresh-token`,
        method: "POST",
        body: refreshToken ? { refreshToken } : undefined,
      }),
    }),

    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { accessToken, refreshToken, ...userData } = data;
          // Store tokens and user data
          dispatch(
            setCredentials({
              accessToken,
              refreshToken,
              userInfo: userData,
            })
          );
          // Backup to localStorage
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          localStorage.setItem("userInfo", JSON.stringify(userData));
        } catch (error) {
          console.error("Login failed:", error);
        }
      },
    }),

    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { accessToken, refreshToken, ...userData } = data;
          // Store tokens and user data after registration
          dispatch(
            setCredentials({
              accessToken,
              refreshToken,
              userInfo: userData,
            })
          );
          // Backup to localStorage
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          localStorage.setItem("userInfo", JSON.stringify(userData));
        } catch (error) {
          console.error("Registration failed:", error);
        }
      },
    }),

    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
      invalidatesTags: ["User"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Clear credentials and localStorage
          dispatch(
            setCredentials({
              accessToken: null,
              refreshToken: null,
              userInfo: null,
            })
          );
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("userInfo");
        } catch (error) {
          console.error("Logout failed:", error);
        }
      },
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
