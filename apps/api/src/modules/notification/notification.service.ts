export type SubscriptionNotificationType =
  | "trial_started"
  | "trial_expiring"
  | "trial_expired"
  | "subscription_activated"
  | "subscription_canceled"
  | "payment_received";
import nodemailer from "nodemailer";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html?: string
) => {
  const transporter = createTransporter();

  // If no SMTP configured, just log the email (development mode)
  if (!transporter) {
    console.log(`[Email Notification] To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Text: ${text}`);
    if (html) console.log(`HTML: ${html}`);
    return { success: true, message: "Email mocked (no SMTP configured)" };
  }

  const mailOptions = {
    from: process.env.SMTP_FROM || "no-reply@invoxa.local",
    to,
    subject,
    text,
    ...(html && { html }),
  };

  const info = await transporter.sendMail(mailOptions);
  return { success: true, messageId: info.messageId };
};

export const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const auth = {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  };

  // Only create transporter if we have SMTP configuration
  if (!host) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth,
  });
};