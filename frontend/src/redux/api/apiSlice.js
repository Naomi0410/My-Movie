import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";
import { logout, setCredentials } from "../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    // Get token from localStorage as fallback
    const token =
      getState().auth?.accessToken || localStorage.getItem("accessToken");
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    console.log("Token expired, attempting refresh...");

    // Try getting refresh token from state and localStorage
    const refreshToken =
      api.getState().auth?.refreshToken || localStorage.getItem("refreshToken");
    if (!refreshToken) {
      console.log("No refresh token available");
      api.dispatch(logout());
      return result;
    }

    try {
      const refreshResult = await baseQuery(
        {
          url: "/users/refresh-token",
          method: "POST",
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult?.data) {
        const { accessToken, refreshToken: newRefreshToken } =
          refreshResult.data;

        // Update tokens in localStorage
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        // Update Redux state
        api.dispatch(
          setCredentials({
            accessToken,
            refreshToken: newRefreshToken,
            userInfo: api.getState().auth.userInfo,
          })
        );

        // Retry original request with new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        console.log("Refresh token failed");
        api.dispatch(logout());
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    } catch (error) {
      console.error("Error during token refresh:", error);
      api.dispatch(logout());
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Profile", "Session", "Favorites", "Watchlist"],
  endpoints: () => ({}),
});
