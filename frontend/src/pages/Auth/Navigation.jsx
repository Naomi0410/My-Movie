import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { SiThemoviedatabase } from "react-icons/si";
import { useLogoutMutation } from "../../redux/api/users";
import { logout } from "../../redux/features/auth/authSlice";
import Drawer from "../../component/Drawer";
import ModalView from "../../component/ModalView";
import { motion } from "framer-motion";
import { apiSlice } from "../../redux/api/apiSlice";
import { logo } from "../../assets";

const navLinks = [
  { path: "movies", name: "Movies" },
  { path: "tv", name: "TV Shows" },
  { path: "people", name: "People" },
  { path: "search", name: "Search" },
];

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const dispatch = useDispatch();
  const [logoutApiCall] = useLogoutMutation();
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const confirmLogout = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      // reset RTK Query cache and close UI
      dispatch(apiSlice.util.resetApiState());
      setDropdownOpen(false);
      setShowLogoutModal(false);
      // Force reload to clear all state
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
      // Force logout anyway if API call fails
      dispatch(logout());
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.div
      className="bg-white border-b-2 border-black"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      role="navigation"
      aria-label="Main Navigation"
    >
      <div className="w-full mx-auto 2xl:container">
        {/* Desktop Navigation */}
        <section className="hidden md:flex py-3 px-8 lg:px-12 justify-between items-center">
          <Link to="/" aria-label="Home">
            <img src={logo} alt="MyMovies logo" className="h-10 w-auto" />
          </Link>

          <nav
            className="hidden md:flex gap-3 items-center"
            aria-label="Primary Navigation"
          >
            {navLinks.map(({ path, name }) => (
              <NavLink
                key={path}
                to={`/${path}`}
                className={({ isActive }) =>
                  isActive
                    ? "text-rose-700 font-bold ms-3 md:ms-5 navlink hover:underline hover:ease-in-out"
                    : "text-black font-semibold ms-3 md:ms-5 navlink hover:underline hover:ease-in-out"
                }
              >
                {name}
              </NavLink>
            ))}
          </nav>

          <div className="relative" ref={dropdownRef}>
            {userInfo ? (
              <button
                onClick={toggleDropdown}
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
                className="text-black flex items-center focus:outline-none"
              >
                <div className="avatar avatar-placeholder">
                  <div className="bg-pink-800 text-white font-bold w-10 rounded-full">
                    <span className="text-xs">
                      {userInfo.firstname.slice(0, 1).toUpperCase()}
                      {userInfo.lastname.slice(0, 1).toUpperCase()}
                    </span>
                  </div>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 ml-1 transition-transform ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="black"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                  />
                </svg>
              </button>
            ) : (
              <ul className="flex gap-2 items-center">
                <li>
                  <NavLink
                    to="/login"
                    className="py-2 px-2 rounded-lg bg-black text-white hover:text-black hover:bg-white hover:border-2 border-black"
                  >
                    Login
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/register"
                    className="text-black hover:font-bold hover:underline"
                  >
                    Register
                  </NavLink>
                </li>
              </ul>
            )}

            {dropdownOpen && userInfo && (
              <ul
                role="menu"
                aria-label="User Menu"
                className="absolute right-0 mt-2 w-[8rem] bg-black text-center text-gray-200 rounded shadow-md transition-all duration-200 ease-in-out z-20"
              >
                <p className="pb-2 font-semibold">
                  Hello, {userInfo.firstname}
                </p>
                <li role="menuitem">
                  <NavLink
                    to="/profile"
                    className="block px-2 py-1 hover:border-b border-white"
                  >
                    Profile
                  </NavLink>
                </li>
                <li role="menuitem">
                  <NavLink
                    to="/favourite"
                    className="block px-2 py-1 hover:border-b border-white"
                  >
                    Favourite
                  </NavLink>
                </li>
                <li role="menuitem">
                  <NavLink
                    to="/watchlist"
                    className="block px-2 py-1 hover:border-b border-white"
                  >
                    Watchlist
                  </NavLink>
                </li>
                <li role="menuitem">
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="block w-full border-t px-2 py-2 hover:border-b hover:text-red-500 border-white"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        </section>

        {/* Mobile Navigation */}
        <section className="flex md:hidden py-3 px-3 justify-between items-center">
          <Link to="/" aria-label="Home">
            <img src={logo} alt="MyMovies logo" className="h-6 w-auto" />
          </Link>
          <Drawer />
        </section>
      </div>

      {/* Logout Modal */}
      <ModalView
        show={showLogoutModal}
        handleClose={() => setShowLogoutModal(false)}
        title="Confirm Logout"
        aria-label="Logout Confirmation Modal"
      >
        <p className="font-bold text-black">
          Are you sure you want to log out?
        </p>
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
    </motion.div>
  );
};

export default Navigation;
