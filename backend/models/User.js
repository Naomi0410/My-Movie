import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastname: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
      default: "",
    },
    refreshTokenExpiry: {
      type: Date,
      default: null,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.refreshToken;
        delete ret.refreshTokenExpiry;
        return ret;
      },
    },
  }
);

// 🔍 Indexes
userSchema.index({ email: 1 });
userSchema.index({ refreshToken: 1 }, { sparse: true });

// 🧠 Virtual full name
userSchema.virtual("fullName").get(function () {
  return `${this.firstname} ${this.lastname}`;
});

// 🔒 Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔑 Password comparison
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 🎟️ Refresh token methods
userSchema.methods.setRefreshToken = function (token, expiryInDays = 7) {
  this.refreshToken = token;
  this.refreshTokenExpiry = new Date(
    Date.now() + expiryInDays * 24 * 60 * 60 * 1000
  );
  this.lastLogin = new Date();
};

userSchema.methods.clearRefreshToken = function () {
  this.refreshToken = "";
  this.refreshTokenExpiry = null;
};

userSchema.methods.isValidRefreshToken = function (token) {
  return (
    this.refreshToken === token &&
    this.refreshTokenExpiry &&
    new Date() < this.refreshTokenExpiry
  );
};

const User = mongoose.model("User", userSchema);
export default User;
