import jwt from "jsonwebtoken";

const JWT_ACCESS_TOKEN = process.env.JWT_ACCESS_TOKEN;
const JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN;

const createToken = (res, userId) => {
  const accessToken = jwt.sign({ userId }, JWT_ACCESS_TOKEN, {
    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY || "30m",
  });

  const refreshToken = jwt.sign({ userId }, JWT_REFRESH_TOKEN, {
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY || "1d",
  });

  const cookieOptions = {
    httpOnly: true,
    secure: true, 
    sameSite: "None",
  };

  res.cookie("jwt", accessToken, {
    ...cookieOptions,
    maxAge: 30 * 60 * 1000, 
  });

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 24 * 60 * 60 * 1000,
  });

  return { accessToken, refreshToken };
};

export default createToken;
