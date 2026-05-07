import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  // Setup transporter - replace with real SMTP in production (.env)
  // For development, you can use Mailtrap, SendGrid, or Gmail App Passwords
  const isGmail = process.env.SMTP_HOST === "smtp.gmail.com";

  const transporter = nodemailer.createTransport({
    service: isGmail ? "gmail" : undefined,
    host: isGmail ? undefined : (process.env.SMTP_HOST || "smtp.mailtrap.io"),
    // If Gmail, port 587 is much more likely to work on Render/AWS than 465
    port: isGmail ? 587 : (process.env.SMTP_PORT || 2525),
    secure: false, // Use false for 587
    family: 4,     // 👈 FORCE IPv4
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
  });

  const message = {
    from: `${process.env.FROM_NAME || "E-Commerce Luxury"} <${process.env.FROM_EMAIL || "noreply@ecommerce.com"}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html, // Optional HTML fallback
  };

  try {
    const info = await transporter.sendMail(message);
    console.log("Email sent successfully: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Critical Email Transmission Error:", error);
    throw error;
  }
};

export default sendEmail;
