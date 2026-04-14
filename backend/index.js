// packages
import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import compression from "compression";
import rateLimit from "express-rate-limit";

// Utiles
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import razorpayRoutes from "./routes/razorpayRoutes.js";

dotenv.config();

// FATAL Start-up Safety Checks
if (!process.env.MONGO_URI) {
  console.error("FATAL ERROR: MONGO_URI is missing in .env");
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is missing in .env");
  process.exit(1);
}

const port = process.env.PORT || 5100;

// Connect to database
const startServer = async () => {
  await connectDB(); // wait here
  app.listen(port, () => {
    console.log("Server started");
  });
};

startServer();
const app = express();

// Security Middlewares
app.use(helmet());
app.use(mongoSanitize());
app.use(compression());

// Rate Limiting API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes"
});
app.use("/api", apiLimiter);

// ✅ Enable CORS before routes
const allowedOrigins = [
  "http://localhost:5173", // local development
  process.env.FRONTEND_URL, // Deployed frontend URL from environment
].filter(Boolean); // Remove undefined values

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Check if origin exactly matches our allowed list securely
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // if using cookies/auth headers
  })
);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/razorpay", razorpayRoutes);

// Root route
app.get("/", (req, res) => {
  res.send(express.json("API is running...."));
});
// Razorpay configuration
app.get("/api/config/razorpay", (req, res) => {
  res.json({
    key_id: process.env.RAZORPAY_KEY_ID,
    currency: "INR",
  });
});

// Global Error handler
app.use((err, req, res, next) => {
  let message = err.message || "Internal Server Error";
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Resource not found (Invalid ID)";
  }

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  res.status(err.statusCode || statusCode).json({
    message: message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Start server
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
