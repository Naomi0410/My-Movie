import jwt from "jsonwebtoken";

const createToken = (res, userId) => {
  // Access Token
  const accessToken = jwt.sign({ userId }, process.env.JWT_ACCESS_TOKEN, {
    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY || "15m",
  });

  // Refresh Token
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_TOKEN, {
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY || "1d",
  });

  // Set both tokens as HTTP-only cookies
  const isProduction = process.env.NODE_ENV === "production";
  res.cookie("jwt", accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    maxAge: 30 * 60 * 1000,
  });
  console.log("Generated access token:", accessToken);

res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "strict" : "lax",
  maxAge: 24 * 60 * 60 * 1000,
});

  return { accessToken, refreshToken };
};

export default createToken;
