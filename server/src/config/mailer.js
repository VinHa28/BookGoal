import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to, subject, text, html) => {
  try {
    const mailOptions = {
      from: `"Your App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: html || `<p>${text}</p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully to:", to);
    console.log("📩 Message ID:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Failed to send email:", error.message);
    return { success: false, error: error.message };
  }
};

export default transporter;
