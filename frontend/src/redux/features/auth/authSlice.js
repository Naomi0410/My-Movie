import { createSlice } from "@reduxjs/toolkit";

// Get stored user info
let parsedUserInfo = null;
try {
  const raw = localStorage.getItem("userInfo");
  if (raw && raw !== "undefined") {
    parsedUserInfo = JSON.parse(raw);
  }
} catch (err) {
  console.warn("Failed to parse userInfo from localStorage:", err);
}

const initialState = {
  userInfo: parsedUserInfo,
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { accessToken, refreshToken, ...userData } = action.payload ?? {};
      
      state.userInfo = userData;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;

      // Store separately for persistence
      localStorage.setItem("userInfo", JSON.stringify(userData));
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      if (accessToken) {
        const expirationTime = Date.now() + 30 * 60 * 1000; // 30 minutes
        localStorage.setItem("expirationTime", expirationTime);
      }
    },
    logout: (state) => {
      state.userInfo = null;
      state.accessToken = null;
      state.refreshToken = null;
      localStorage.removeItem("userInfo");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("expirationTime");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;