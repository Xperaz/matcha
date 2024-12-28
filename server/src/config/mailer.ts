
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendMail = async ( to: string, subject: string, text: string, html?: string ) => {
  try {
    const info = await transporter.sendMail({
      from: `"matcha" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    return info;
    
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
