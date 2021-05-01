import SMTPTransport from "nodemailer/lib/smtp-transport";

/** Edit this SMTP config based on the email server/service used */
// I used my own gmail account for testing
export const emailConfig = {
  service: 'gmail',
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_EMAIL_PASSWORD,
  }
} as SMTPTransport.Options