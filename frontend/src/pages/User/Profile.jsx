import { useSelector, useDispatch } from "react-redux";
import { useLocation, NavLink, Outlet } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import { useState } from "react";
import { toast } from "react-toastify";
import { useDeleteAccountMutation } from "../../redux/api/users";
import { logout } from "../../redux/features/auth/authSlice";
import { formatDate } from "../../utils/formatDate";
import ModalView from "../../component/ModalView";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const child = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Profile() {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const [modalShow, setModalShow] = useState(false);
  const [deleteAccount, { isLoading: isDeleting }] = useDeleteAccountMutation();

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount().unwrap();
      toast.success("Account deleted successfully");
      dispatch(logout());
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err?.data?.message || "Failed to delete account");
    }
  };

  return (
    <div
      className="mx-auto 2xl:container px-3 md:px-8 lg:px-12 py-12"
      role="main"
      aria-label="User Profile Page"
    >
      {/* Animated Greeting */}
      <motion.h1
        className="text-xl md:text-2xl lg:text-3xl font-bold text-white flex flex-wrap"
        variants={container}
        initial="hidden"
        animate="visible"
        aria-label={`Hi, ${userInfo.firstname}`}
      >
        {`Hi, ${userInfo.firstname}`.split("").map((char, index) => (
          <motion.span key={index} variants={child}>
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.h1>

      <motion.div
        className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Navigation */}
        <nav className="space-y-4 md:col-span-1" aria-label="Profile Navigation">
          <div className="flex justify-between items-center">
            <NavLink
              to="/profile"
              className={`font-semibold ${
                location.pathname === "/profile" ? "text-white" : "text-gray-500"
              }`}
            >
              My Account
            </NavLink>
            <NavLink
              to="/profile/edit"
              className={`md:hidden flex items-center gap-1 ${
                location.pathname === "/profile/edit" ? "text-white" : "text-gray-500"
              }`}
            >
              <MdEdit size="20px" />
              Edit
            </NavLink>
          </div>
          <NavLink
            to="/profile/edit"
            className={`hidden md:block font-semibold ${
              location.pathname === "/profile/edit" ? "text-white" : "text-gray-500"
            }`}
          >
            Edit Account
          </NavLink>
        </nav>

        {/* Account Overview */}
        <section
          className="flex gap-4 items-center flex-col justify-center md:col-span-2"
          aria-label="Account Overview"
        >
          <div className="bg-white border rounded-xl shadow-sm p-5 space-y-4 w-full xl:w-4/5">
            <h2 className="text-xl font-bold text-black">Account Overview</h2>
            <div className="flex justify-between flex-wrap">
              <div>
                <p className="uppercase text-sm font-bold mb-1 text-black">Firstname</p>
                <p className="text-gray-600">{userInfo?.firstname}</p>
              </div>
              <div className="flex flex-col items-end">
                <p className="uppercase text-sm font-bold mb-1 text-black">Lastname</p>
                <p className="text-gray-600">{userInfo?.lastname}</p>
              </div>
            </div>
            <div className="flex justify-between flex-wrap gap-3">
              <div>
                <p className="uppercase text-sm font-bold mb-1 text-black">Email</p>
                <p className="text-gray-600">{userInfo?.email}</p>
              </div>
              <div className="flex flex-col md:items-start lg:items-end">
                <p className="uppercase text-sm font-bold mb-1 text-black">Date Registered</p>
                <p className="text-gray-600">{formatDate(userInfo?.createdAt)}</p>
              </div>
            </div>
          </div>
          <div className="w-full">
            <Outlet />
          </div>
        </section>

        {/* Delete Button */}
        <div className="flex justify-center md:justify-end items-start md:col-span-1">
          <motion.button
            className="bg-red-600 text-white px-2 py-2 rounded-md w-full lg:w-3/4 hover:bg-red-700 transition"
            type="button"
            onClick={() => setModalShow(true)}
            whileTap={{ scale: 0.95 }}
            aria-label="Delete Account"
          >
            DELETE ACCOUNT
          </motion.button>
        </div>
      </motion.div>

      {/* Modal */}
      <ModalView
        show={modalShow}
        handleClose={() => setModalShow(false)}
        title="Delete account"
      >
        <p className="font-bold text-black">
          You are about to permanently delete your account.
        </p>
        <p className="text-gray-400">
          Deleting your account is permanent and cannot be reversed. Are you sure?
        </p>
        <div className="flex justify-end items-center gap-4 mt-4">
          <button
            className="btn px-2 text-black border hover:border-teal-400"
            onClick={() => setModalShow(false)}
          >
            Cancel
          </button>
          <button
            className={`btn ${
              isDeleting ? "btn-disabled" : "bg-red-500"
            } text-white px-2 hover:bg-red-600`}
            onClick={handleDeleteAccount}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "DELETE ACCOUNT"}
          </button>
        </div>
      </ModalView>
    </div>
  );
}
