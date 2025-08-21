import dotenv from "dotenv";

dotenv.config();

export const appConfig = {
  port: process.env.PORT || 8000,
  jwtSecret: process.env.JWT_SECRET,
}