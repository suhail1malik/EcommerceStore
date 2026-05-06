// backend/controllers/productController.js
import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import cloudinary from "../config/cloudinary.js"; // make sure this exists and reads env
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 60 * 5 }); // 5 minute cache

const uploadToCloudinary = async (filePath, folder = "ecommerce_products") => {
  // cloudinary.uploader.upload accepts a file path
  const result = await cloudinary.uploader.upload(filePath, { folder });
  return result; // contains secure_url, public_id, etc.
};

const addProduct = asyncHandler(async (req, res) => {
  // express-formidable puts text fields in req.fields and files in req.files
  const { name, description, price, category, quantity, brand, originalPrice } = req.fields;
  
  let gallery = [];
  try {
    if (req.fields.images) {
       gallery = JSON.parse(req.fields.images);
    }
  } catch (e) {
    console.warn("Images was not valid JSON", e);
  }

  // Validation
  switch (true) {
    case !name:
      return res.status(400).json({ error: "Name is required" });
    case !brand:
      return res.status(400).json({ error: "Brand is required" });
    case !description:
      return res.status(400).json({ error: "Description is required" });
    case !price:
      return res.status(400).json({ error: "Price is required" });
    case !category:
      return res.status(400).json({ error: "Category is required" });
    case !quantity:
      return res.status(400).json({ error: "Quantity is required" });
  }

  // Handle image upload (if provided)
  let image = "";
  if (req.fields && (req.fields.image || req.fields.imageUrl)) {
    image = req.fields.image || req.fields.imageUrl;
  } else if (req.files && req.files.image && req.files.image.path) {
    try {
      const uploadResult = await uploadToCloudinary(req.files.image.path);
      image = uploadResult.secure_url;
    } catch (err) {
      console.error("Cloudinary upload error (addProduct):", err);
      return res
        .status(500)
        .json({ error: "Image upload failed", details: err.message });
    }
  }

  // Calculate discount if originalPrice exists
  let discount = 0;
  if (originalPrice && Number(originalPrice) > Number(price)) {
    discount = Math.round(((Number(originalPrice) - Number(price)) / Number(originalPrice)) * 100);
  }

  const product = new Product({
    name,
    description,
    price,
    category,
    quantity,
    brand,
    originalPrice: originalPrice || price,
    discount,
    image: image || "/uploads/default-product.jpg",
    images: gallery,
    countInStock: quantity, // Initialize stock with quantity
  });

  await product.save();
  cache.flushAll(); // Flush cache on new product
  res.status(201).json(product);
});

const updateProductDetails = asyncHandler(async (req, res) => {
  const { name, description, price, category, quantity, brand, originalPrice } = req.fields;
  
  let gallery = [];
  try {
    if (req.fields.images) {
       gallery = JSON.parse(req.fields.images);
    }
  } catch (e) {
    console.warn("Images was not valid JSON in update", e);
  }

  // Validation
  switch (true) {
    case !name:
      return res.status(400).json({ error: "Name is required" });
    case !brand:
      return res.status(400).json({ error: "Brand is required" });
    case !description:
      return res.status(400).json({ error: "Description is required" });
    case !price:
      return res.status(400).json({ error: "Price is required" });
    case !category:
      return res.status(400).json({ error: "Category is required" });
    case !quantity:
      return res.status(400).json({ error: "Quantity is required" });
  }

  // Build update data with explicit fields
  const updateData = {
    name,
    description,
    price,
    category,
    quantity,
    brand,
    countInStock: quantity,
  };

  if (req.fields.images !== undefined) {
    updateData.images = gallery;
  }

  // Recalculate discount
  if (originalPrice && Number(originalPrice) > Number(price)) {
    updateData.discount = Math.round(((Number(originalPrice) - Number(price)) / Number(originalPrice)) * 100);
    updateData.originalPrice = originalPrice;
  } else {
    updateData.discount = 0;
    updateData.originalPrice = price;
  }

  // If a new image is provided, upload to Cloudinary and replace URL
  if (req.files && req.files.image) {
    const file = req.files.image;
    try {
      const uploadResult = await uploadToCloudinary(
        file.path,
        "ecommerce_products"
      );
      updateData.image = uploadResult.secure_url;
    } catch (err) {
      console.error("Cloudinary upload error (updateProductDetails):", err);
      return res
        .status(500)
        .json({ error: "Image upload failed", details: err.message });
    }
  }

  const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
  });

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  cache.flushAll(); // Flush cache on product update
  res.json(product);
});

const removeProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  cache.flushAll(); // Flush cache on product removal
  res.json(product);
});

const fetchProducts = asyncHandler(async (req, res) => {
  const pageSize = 6;
  const page = Number(req.query.pageNumber) || 1;
  const keywordString = req.query.keyword || "";

  // Make unique cache key based on query filters
  const cacheKey = `fetchProducts_${page}_${keywordString}`;
  if (cache.has(cacheKey)) {
    return res.json(cache.get(cacheKey));
  }

  const keyword = keywordString
    ? {
        $or: [
          // Exact substring match (highest relevance)
          { name: { $regex: keywordString, $options: "i" } },
          { brand: { $regex: keywordString, $options: "i" } },
          { description: { $regex: keywordString, $options: "i" } },
          
          // Split-word match: find if any word in query matches
          ...keywordString.split(/\s+/).filter(w => w.length > 2).map(word => ({
             name: { $regex: word, $options: "i" }
          })),

          // Typo-tolerant: allow characters to be skipped (e.g. "iphne" -> "iphone")
          // Only apply for words longer than 3 chars to avoid over-matching
          ...(keywordString.length > 3 ? [{ name: { $regex: keywordString.split("").join(".*"), $options: "i" } }] : [])
        ]
      }
    : {};

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .lean()
    .populate("category")
    .skip(pageSize * (page - 1))
    .limit(pageSize);

  const responseData = {
    products,
    page,
    pages: Math.ceil(count / pageSize),
    hasMore: page * pageSize < count,
  };

  cache.set(cacheKey, responseData);
  res.json(responseData);
});

const fetchProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .lean()
    .populate("category");

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.json(product);
});

const fetchAllProducts = asyncHandler(async (req, res) => {
  const cacheKey = "fetchAllProducts";
  if (cache.has(cacheKey)) {
    return res.json(cache.get(cacheKey));
  }

  const products = await Product.find({})
    .lean()
    .populate("category")
    .limit(12)
    .sort({ createdAt: -1 });

  cache.set(cacheKey, products);
  res.json(products);
});

const addProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    return res.status(400).json({ error: "Product already reviewed" });
  }

  const orders = await Order.find({ user: req.user._id, isPaid: true });
  const hasPurchased = orders.some((order) =>
    order.orderItems.some((item) => item.product.toString() === product._id.toString())
  );

  const review = {
    name: req.user.username,
    rating: Number(rating),
    comment,
    isVerifiedPurchase: hasPurchased,
    user: req.user._id,
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save();
  cache.flushAll(); // Flush cache when product rating updates
  res.status(201).json({ message: "Review added" });
});

const fetchTopProducts = asyncHandler(async (req, res) => {
  const cacheKey = "fetchTopProducts";
  if (cache.has(cacheKey)) {
    return res.json(cache.get(cacheKey));
  }

  const products = await Product.find({})
    .lean()
    .populate("category")
    .sort({ rating: -1 })
    .limit(4);
  cache.set(cacheKey, products);
  res.json(products);
});

const fetchNewProducts = asyncHandler(async (req, res) => {
  const cacheKey = "fetchNewProducts";
  if (cache.has(cacheKey)) {
    return res.json(cache.get(cacheKey));
  }

  const products = await Product.find({})
    .lean()
    .populate("category")
    .sort({ _id: -1 })
    .limit(5);
  cache.set(cacheKey, products);
  res.json(products);
});

const filterProducts = asyncHandler(async (req, res) => {
  const { checked = [], radio = [] } = req.body;

  let args = {};
  if (checked.length > 0) args.category = checked;
  if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

  const products = await Product.find(args).lean().populate("category");
  res.json(products);
});

export {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
};
