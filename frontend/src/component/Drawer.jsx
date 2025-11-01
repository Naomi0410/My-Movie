import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosMenu } from "react-icons/io";
import { MdLogout } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "../redux/api/users";
import { logout } from "../redux/features/auth/authSlice";
import { apiSlice } from "../redux/api/apiSlice";
import ModalView from "./ModalView";
import { motion, AnimatePresence } from "framer-motion";


const navLinks = [
  { path: "/movies", name: "Movies" },
  { path: "/tv", name: "TV Shows" },
  { path: "/people", name: "People" },
  { path: "/search", name: "Search" },
];

const Drawer = () => {
  const [open, setOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const confirmLogout = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      // reset RTK Query cache and close UI
      dispatch(apiSlice.util.resetApiState());
      setOpen(false);
      setShowLogoutModal(false);
      navigate("/");
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open navigation drawer"
        className="text-black"
      >
        <IoIosMenu size="30px" className="cursor-pointer" />
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Drawer Panel */}
      <AnimatePresence>
        {open && (
          <motion.nav
            className="fixed top-0 left-0 h-full w-64 bg-black text-white z-50 p-4 flex flex-col gap-4"
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3 }}
            role="navigation"
            aria-label="Mobile Navigation Drawer"
          >
            <button
              className="self-end text-white"
              onClick={() => setOpen(false)}
              aria-label="Close drawer"
            >
              ✕
            </button>

            {navLinks.map(({ path, name }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setOpen(false)}
                className="hover:underline"
              >
                {name}
              </Link>
            ))}

            <hr className="border-gray-600" />

            {userInfo ? (
              <>
                <span>Hello, {userInfo.firstname}</span>
                <Link to="/profile" onClick={() => setOpen(false)}>
                  Profile
                </Link>
                <Link to="/favourite" onClick={() => setOpen(false)}>
                  Favourite
                </Link>
                <Link to="/watchlist" onClick={() => setOpen(false)}>
                  Watchlist
                </Link>
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="flex items-center gap-2"
                  aria-label="Logout"
                >
                  <MdLogout />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)}>
                  Login
                </Link>
                <Link to="/register" onClick={() => setOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      <ModalView
        show={showLogoutModal}
        handleClose={() => setShowLogoutModal(false)}
        title="Confirm Logout"
        aria-label="Logout Confirmation Modal"
      >
        <p className="font-bold text-black">Are you sure you want to log out?</p>
        <div className="flex justify-end items-center gap-4 mt-4">
          <button
            className="btn text-black px-2 hover:border"
            onClick={() => setShowLogoutModal(false)}
          >
            Cancel
          </button>
          <button
            className="btn bg-rose-900 text-white px-2"
            onClick={confirmLogout}
          >
            Logout
          </button>
        </div>
      </ModalView>
    </>
  );
};

export default Drawer;
