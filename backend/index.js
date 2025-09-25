// packages
import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

// Utiles
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import razorpayRoutes from "./routes/razorpayRoutes.js";

dotenv.config();
const port = process.env.PORT || 5100;

// Connect to database
connectDB();
const app = express();

// ✅ Enable CORS before routes
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend URL
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

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Start server
app.listen(port, () => console.log(`Server running on port ${port}`));
