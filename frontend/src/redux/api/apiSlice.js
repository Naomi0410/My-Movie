import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";
import { logout, setCredentials } from "../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include", // sends cookies
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    const refreshResult = await baseQuery(
      "/users/refresh-token",
      api,
      extraOptions
    );

    if (refreshResult?.data) {
      api.dispatch(setCredentials(refreshResult.data)); // ✅ update Redux
      result = await baseQuery(args, api, extraOptions); // ✅ retry original request
    } else {
      console.warn("Refresh token failed:", refreshResult?.error);
      api.dispatch(logout());
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Profile", "Session", "Favorites", "Watchlist"],
  endpoints: () => ({}),
});
