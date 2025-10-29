import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

import { setCredentials } from "../../redux/features/auth/authSlice";
import { useRegisterMutation } from "../../redux/api/users";
import { registerImg } from "../../assets";
import { apiSlice } from "../../redux/api/apiSlice";

const Register = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { firstname, lastname, email, password, confirmPassword } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, navigate, redirect]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await register({
        firstname,
        lastname,
        email,
        password,
      }).unwrap();
      dispatch(setCredentials(res));
      dispatch(apiSlice.util.resetApiState());
      toast.success("Registration successful");
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || "Registration failed");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-black text-white"
      role="main"
      aria-label="Register Page"
    >
      <motion.section
        className="flex flex-wrap w-full max-w-8xl p-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Form Section */}
        <motion.div
          className="flex-1 mb-8 md:mb-0 md:mr-8"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold mb-6" id="register-title">
            Register
          </h1>

          <form
            onSubmit={submitHandler}
            className="space-y-6"
            aria-labelledby="register-title"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label htmlFor="firstname" className="block text-sm font-medium">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  className="mt-1 p-2 w-full border rounded text-white"
                  placeholder="Enter First Name"
                  value={firstname}
                  onChange={handleChange}
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <label htmlFor="lastname" className="block text-sm font-medium">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  className="mt-1 p-2 w-full border rounded text-white"
                  placeholder="Enter Last Name"
                  value={lastname}
                  onChange={handleChange}
                  required
                  aria-required="true"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 p-2 w-full border rounded text-white"
                placeholder="Enter Email"
                value={email}
                onChange={handleChange}
                required
                aria-required="true"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="mt-1 p-2 w-full border rounded text-white"
                placeholder="Enter Password"
                value={password}
                onChange={handleChange}
                required
                aria-required="true"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="mt-1 p-2 w-full border rounded text-white"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={handleChange}
                required
                aria-required="true"
              />
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              className="bg-rose-800 hover:bg-rose-900 text-white px-4 py-2 rounded w-full"
              whileTap={{ scale: 0.97 }}
              aria-label="Register"
            >
              {isLoading ? "Registering..." : "Register"}
            </motion.button>
          </form>

          <p className="mt-4 text-sm">
            Already have an account?{" "}
            <Link
              to={redirect ? `/login?redirect=${redirect}` : "/login"}
              className="text-rose-600 hover:underline"
              aria-label="Go to login page"
            >
              Login
            </Link>
          </p>
        </motion.div>

        {/* Image Section */}
        <motion.div
          className="flex md:flex-1"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          aria-hidden="true"
        >
          <img
            src={registerImg}
            alt="Register visual"
            className="rounded-lg h-[400px] w-[400px] md:h-[500px] lg:w-[500px] object-cover"
          />
        </motion.div>
      </motion.section>
    </div>
  );
};

export default Register;
