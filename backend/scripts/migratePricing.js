import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/productModel.js";
import connectDB from "../config/db.js";

dotenv.config();

const migratePricing = async () => {
  try {
    await connectDB();

    const products = await Product.find({});
    console.log(`Found ${products.length} products for migration.`);

    for (let product of products) {
      // Generate random discount between 10% and 20%
      const discountPercent = Math.floor(Math.random() * (20 - 10 + 1)) + 10;
      
      // price is the discounted price
      // originalPrice = price / (1 - (discount / 100))
      // But user said originalPrice 10-20% higher than price.
      // Let's assume originalPrice is price * (1 + (discountPercent / 100))
      
      const multiplier = 1 + (discountPercent / 100);
      const originalPrice = Math.round(product.price * multiplier);
      
      product.originalPrice = originalPrice;
      product.discount = discountPercent;
      
      await product.save();
      console.log(`Updated ${product.name}: Price=${product.price}, Original=${product.originalPrice}, Discount=${product.discount}%`);
    }

    console.log("Migration completed successfully!");
    process.exit();
  } catch (error) {
    console.error(`Error during migration: ${error.message}`);
    process.exit(1);
  }
};

migratePricing();
