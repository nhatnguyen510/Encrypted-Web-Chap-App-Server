import nodemailer from "nodemailer";

import { MAILER } from "../../config/index.js";

export const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: MAILER.MAILER_USERNAME,
    pass: MAILER.MAILER_PASSWORD,
  },
});
