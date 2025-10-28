import { Outlet, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navigation from "./pages/Auth/Navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "./redux/features/auth/authSlice";

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!userInfo) return;

    const logoutTimer = setTimeout(() => {
      toast.info("Session expired. Please log in again.");
      dispatch(setCredentials(null));
      navigate("/login");
    }, 30 * 60 * 1000); // 15 minutes

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
