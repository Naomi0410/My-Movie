import { rateLimit } from "express-rate-limit";

export const limitRequests = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
  statusCode: 429,
  headers: true, // Return rate limit info in headers
  // Customize headers if needed
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
});

export default limitRequests;