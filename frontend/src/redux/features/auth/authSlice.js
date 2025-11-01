import { createSlice } from "@reduxjs/toolkit";

// Check if running in browser
const isBrowser = typeof window !== "undefined";

// Safe parse helpers
const safeParse = (key) => {
  if (!isBrowser) return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const safeGet = (key) => {
  if (!isBrowser) return null;
  return localStorage.getItem(key);
};

const initialState = {
  userInfo: safeParse("userInfo"),
  accessToken: safeGet("accessToken"),
  refreshToken: safeGet("refreshToken"),
  expirationTime: safeGet("expirationTime")
    ? Number(safeGet("expirationTime"))
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const {
        accessToken = null,
        refreshToken = null,
        userInfo = null,
        expirationTime = null,
      } = action.payload ?? {};

      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.userInfo = userInfo ?? state.userInfo;
      state.expirationTime = expirationTime ?? state.expirationTime;

      if (isBrowser) {
        if (userInfo && typeof userInfo === "object") {
          localStorage.setItem("userInfo", JSON.stringify(userInfo));
        }

        accessToken
          ? localStorage.setItem("accessToken", accessToken)
          : localStorage.removeItem("accessToken");

        refreshToken
          ? localStorage.setItem("refreshToken", refreshToken)
          : localStorage.removeItem("refreshToken");

        if (expirationTime !== null) {
          localStorage.setItem("expirationTime", String(expirationTime));
        }
      }
    },

    logout: (state) => {
      state.userInfo = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.expirationTime = null;

      if (isBrowser) {
        localStorage.removeItem("userInfo");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("expirationTime");
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

// Optional: Selector to check if user is authenticated
export const selectIsAuthenticated = (state) =>
  state.auth.accessToken && state.auth.expirationTime > Date.now();

export default authSlice.reducer;
