import jwt from "jsonwebtoken";

const JWT_ACCESS_TOKEN = "supersecretkey";
const JWT_REFRESH_TOKEN = "somethingsecret";

const createToken = (res, userId) => {
  const accessToken = jwt.sign({ userId }, JWT_ACCESS_TOKEN, {
    expiresIn: "30m",
  });

  const refreshToken = jwt.sign({ userId }, JWT_REFRESH_TOKEN, {
    expiresIn: "1d",
  });

  // Always use secure + SameSite=None for cross-site cookies
  const cookieOptions = {
    httpOnly: true,
    secure: true, // Required for SameSite=None
    sameSite: "None", // Allows cross-origin cookies
  };

  res.cookie("jwt", accessToken, {
    ...cookieOptions,
    maxAge: 30 * 60 * 1000, // 30 minutes
  });

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 24 * 60 * 60 * 1000, 
  });

  return { accessToken, refreshToken };
};

export default createToken;
