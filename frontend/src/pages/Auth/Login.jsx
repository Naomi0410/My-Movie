import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { useLoginMutation } from "../../redux/api/users";
import { loginImg } from "../../assets";
import { apiSlice } from "../../redux/api/apiSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, navigate, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({
        email: email.trim().toLowerCase(),
        password,
      }).unwrap();
      dispatch(setCredentials(res));
      dispatch(apiSlice.util.resetApiState());
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-black text-white"
      role="main"
      aria-label="Login Page"
    >
      <motion.section
        className="flex flex-wrap w-full max-w-6xl p-8"
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
          <h1 className="text-3xl font-bold mb-6" id="login-title">
            Sign In
          </h1>
          <form
            onSubmit={submitHandler}
            className="space-y-6"
            aria-labelledby="login-title"
          >
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 p-2 w-full border rounded text-white bg-gray-900"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-required="true"
                aria-label="Email Address"
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="mt-1 p-2 w-full border rounded text-white bg-gray-900"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-required="true"
                aria-label="Password"
              />
              <button
                type="button"
                className="absolute top-9 right-3 cursor-pointer text-gray-500"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              aria-busy={isLoading}
              className="bg-rose-800 hover:bg-rose-900 text-white px-4 py-2 rounded w-full"
              whileTap={{ scale: 0.97 }}
              aria-label="Sign In"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </motion.button>
          </form>

          <p className="mt-4 text-sm">
            New Customer?{" "}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
              className="text-rose-600 font-semibold hover:underline"
              aria-label="Register a new account"
            >
              Register
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
            src={loginImg}
            alt="Login visual"
            className="rounded-lg h-[400px] w-[400px] lg:h-[500px] lg:w-[500px] object-cover"
          />
        </motion.div>
      </motion.section>
    </div>
  );
};

export default Login;
