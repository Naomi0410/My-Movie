import dotenv from "dotenv";
dotenv.config(); // ✅ Load .env before validation

import { cleanEnv } from "envalid";
import { str, port } from "envalid/dist/validators.js";

export default cleanEnv(process.env, {
  MONGO_URI: str(),
  PORT: port({ default: 3000, desc: "Port for the server" }),
  JWT_ACCESS_TOKEN: str(),
  JWT_ACCESS_TOKEN_EXPIRY: str(),
  JWT_REFRESH_TOKEN: str(),
  JWT_REFRESH_TOKEN_EXPIRY: str(),
  NODE_ENV: str(),
  TMDB_API_KEY: str(),
  TMDB_BASE_URL: str(),
});
