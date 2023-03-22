import dotenv from "dotenv";
dotenv.config();

export const config = {
  DATABASE: {
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
  },
  MAILER: {
    MAILER_FROM: process.env.MAILER_FROM,
    MAILER_USERNAME: process.env.MAILER_USERNAME,
    MAILER_PASSWORD: process.env.MAILER_PASSWORD,
  },
  SECRET: {
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  },
  PORT: process.env.PORT,
};