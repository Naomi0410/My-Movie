import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useUpdateProfileMutation } from "../../redux/api/users";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

export default function EditProfile() {
  const [reveal, setReveal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      firstname: userInfo?.firstname || "",
      lastname: userInfo?.lastname || "",
      email: userInfo?.email || "",
      currentPassword: "",
      password: "",
    },
  });

  const [updateProfile] = useUpdateProfileMutation();

  const onFormSubmit = async (data) => {
    try {
      const res = await updateProfile(data).unwrap();
      toast.success(res.msg || "Profile updated successfully");
      dispatch(setCredentials(res.updatedUser));
    } catch (err) {
      toast.error(err?.data?.message || "Update failed");
    }
  };

  return (
    <motion.div
      className="flex justify-center md:col-span-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      role="region"
      aria-label="Edit Profile Form"
    >
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="bg-white border rounded-xl shadow-sm p-5 space-y-4 w-full xl:w-4/5"
        aria-labelledby="edit-profile-title"
      >
        <h5 id="edit-profile-title" className="text-xl font-bold text-black">
          Edit Account
        </h5>

        {/* Firstname & Lastname */}
        <div className="flex justify-between flex-wrap gap-4">
          <div className="w-full lg:w-[48%]">
            <label htmlFor="firstname" className="uppercase text-sm font-bold mb-1 text-black block">
              Firstname
            </label>
            <input
              id="firstname"
              type="text"
              {...register("firstname", { required: "Firstname is required" })}
              className="w-full border rounded-md px-2 py-2 bg-gray-200 text-gray-700"
              aria-invalid={errors.firstname ? "true" : "false"}
            />
            {errors.firstname && (
              <p className="text-red-500 text-sm mt-1">{errors.firstname.message}</p>
            )}
          </div>
          <div className="w-full lg:w-[48%]">
            <label htmlFor="lastname" className="uppercase text-sm font-bold mb-1 text-black block">
              Lastname
            </label>
            <input
              id="lastname"
              type="text"
              {...register("lastname", { required: "Lastname is required" })}
              className="w-full border rounded-md px-2 py-2 bg-gray-200 text-gray-700"
              aria-invalid={errors.lastname ? "true" : "false"}
            />
            {errors.lastname && (
              <p className="text-red-500 text-sm mt-1">{errors.lastname.message}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="uppercase text-sm font-bold mb-1 text-black block">
            Email address
          </label>
          <input
            id="email"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email format",
              },
            })}
            className="w-full border rounded-md px-2 py-2 bg-gray-200 text-gray-700"
            placeholder="john@email.com"
            aria-invalid={errors.email ? "true" : "false"}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Current Password */}
        <div className="relative">
          <label htmlFor="currentPassword" className="uppercase text-sm font-bold mb-1 text-black block">
            Current Password
          </label>
          <input
            id="currentPassword"
            type={reveal ? "text" : "password"}
            {...register("currentPassword", { required: "Current password is required" })}
            className="w-full border rounded-md px-2 py-2 bg-gray-200 text-gray-700"
            placeholder="**********"
            aria-invalid={errors.currentPassword ? "true" : "false"}
          />
          <span
            className="absolute top-9 right-3 cursor-pointer text-gray-500"
            onClick={() => setReveal((prev) => !prev)}
            aria-label={reveal ? "Hide password" : "Show password"}
          >
            {reveal ? <FaRegEyeSlash /> : <FaRegEye />}
          </span>
          {errors.currentPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.currentPassword.message}</p>
          )}
        </div>

        {/* New Password */}
        <div className="relative">
          <label htmlFor="password" className="uppercase text-sm font-bold mb-1 text-black block">
            New Password
          </label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            {...register("password")}
            className="w-full border rounded-md px-2 py-2 bg-gray-200 text-gray-700"
            placeholder="**********"
            aria-invalid={errors.password ? "true" : "false"}
          />
          <span
            className="absolute top-9 right-3 cursor-pointer text-gray-500"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
          </span>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-md w-full"
          whileTap={{ scale: 0.97 }}
          aria-label="Save changes"
        >
          {isSubmitting ? "Saving..." : "Save changes"}
        </motion.button>
      </form>
    </motion.div>
  );
}
