import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import store from "./redux/store.js";
import { Provider } from "react-redux";
import { Route, RouterProvider, createRoutesFromElements } from "react-router";
import { createBrowserRouter } from "react-router-dom";

// Restricted
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";
import PrivateRoute from "./pages/Auth/PrivateRoute.jsx";

import Home from "./pages/Home.jsx";
import Profile from "./pages/User/Profile.jsx";
import Movies from "./pages/Movies/Movies.jsx";
import MovieDetails from "./pages/Movies/MovieDetails.jsx";
import Tv from "./pages/TV/Tv.jsx";
import TvDetails from "./pages/TV/TvDetails.jsx";
import People from "./pages/People/People.jsx";
import PeopleDetails from "./pages/People/PeopleDetails.jsx";
import Search from "./pages/Search.jsx";
import Favourite from "./pages/User/Favourite.jsx";
import Watchlist from "./pages/User/Watchlist.jsx";
import EditProfile from "./pages/User/EditProfile.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<Home />} />
      <Route path="/movies" element={<Movies />} />
      <Route path="/tv" element={<Tv />} />
      <Route path="/people" element={<People />} />
      <Route path="/search" element={<Search />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/movie/:id" element={<MovieDetails />} />
      <Route path="/tv/:id" element={<TvDetails />} />
      <Route path="/people/:id" element={<PeopleDetails />} />
      <Route path="" element={<PrivateRoute />}>
        <Route path="/profile" element={<Profile />}>
          <Route path="edit" element={<EditProfile />} />
        </Route>
        <Route path="/favourite" element={<Favourite />} />
        <Route path="/watchlist" element={<Watchlist />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
