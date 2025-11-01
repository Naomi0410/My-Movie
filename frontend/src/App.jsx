import { Outlet, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navigation from "./pages/Auth/Navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./redux/features/auth/authSlice";

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const expiration = localStorage.getItem("expirationTime");
    if (expiration && new Date().getTime() > +expiration) {
      toast.info("Session expired. Please log in again.");
      dispatch(logout());
      navigate("/login");
      return;
    }
    if (!userInfo) return;
    const timeout = expiration
      ? +expiration - new Date().getTime()
      : 30 * 60 * 1000;
    const logoutTimer = setTimeout(() => {
      toast.info("Session expired. Please log in again.");
      dispatch(logout());
      navigate("/login");
    }, timeout);

    return () => clearTimeout(logoutTimer);
  }, [userInfo, dispatch, navigate]);

  return (
    <>
      <ToastContainer />
      <Navigation />
      <main className="bg-black min-h-screen">
        <Outlet />
      </main>
    </>
  );
};

export default App;

