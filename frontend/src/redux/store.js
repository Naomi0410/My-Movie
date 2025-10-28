import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { apiSlice } from "./api/apiSlice";

// Feature slices
import authReducer from "./features/auth/authSlice";
import moviesReducer from "./features/movies/moviesSlice";
import tvReducer from "./features/tv/tvSlice";
import genreReducer from "./features/genre/genreSlice";
import accountReducer from "./features/account/accountSlice"

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    movies: moviesReducer,
    tv: tvReducer,
    genre: genreReducer,
    account: accountReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

setupListeners(store.dispatch);
export default store;
