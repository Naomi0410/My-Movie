import jwt from "jsonwebtoken";

const JWT_ACCESS_TOKEN = process.env.JWT_ACCESS_TOKEN;
const JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN;

const createToken = (userId) => {
  const accessToken = jwt.sign({ userId }, JWT_ACCESS_TOKEN, {
    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY || "30m",
  });

  const refreshToken = jwt.sign({ userId }, JWT_REFRESH_TOKEN, {
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY || "1d",
  });

  return { accessToken, refreshToken };
};

export default createToken;
