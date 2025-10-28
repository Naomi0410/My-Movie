import { createSlice } from "@reduxjs/toolkit";

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
};


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));

      const expirationTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000;
      localStorage.setItem("expirationTime", expirationTime);
    },

    logout: (state) => {
      state.userInfo = null;
      localStorage.clear();
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;