import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  // Setup transporter - replace with real SMTP in production (.env)
  // For development, you can use Mailtrap, SendGrid, or Gmail App Passwords
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.mailtrap.io",
    port: process.env.SMTP_PORT || 2525,
    auth: {
      user: process.env.SMTP_EMAIL || "your_mailtrap_user",
      pass: process.env.SMTP_PASSWORD || "your_mailtrap_password",
    },
  });

  const message = {
    from: `${process.env.FROM_NAME || "E-Commerce Luxury"} <${process.env.FROM_EMAIL || "noreply@ecommerce.com"}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html, // Optional HTML fallback
  };

  const info = await transporter.sendMail(message);
  console.log("Email sent: %s", info.messageId);
};

export default sendEmail;
