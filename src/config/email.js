import nodemailer from "nodemailer";
import { config } from "./index.js";

export const transporter = nodemailer.createTransport({
  // config mail server
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: config.MAILER.MAILER_USERNAME,
    pass: config.MAILER.MAILER_PASSWORD,
  },
});
