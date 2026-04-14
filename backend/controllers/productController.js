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
  const { name, description, price, category, quantity, brand } = req.fields;
  
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

  const product = new Product({
    ...req.fields,
    image: image || "/uploads/default-product.jpg",
    images: gallery,
  });

  await product.save();
  cache.flushAll(); // Flush cache on new product
  res.status(201).json(product);
});

const updateProductDetails = asyncHandler(async (req, res) => {
  const { name, description, price, category, quantity, brand } = req.fields;
  
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

  // Build update data from fields
  const updateData = { ...req.fields };
  if (req.fields.images !== undefined) {
    updateData.images = gallery;
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
        name: {
          $regex: keywordString,
          $options: "i",
        },
      }
    : {};

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .lean()
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
  const product = await Product.findById(req.params.id).lean();

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

  const products = await Product.find({}).lean().sort({ rating: -1 }).limit(4);
  cache.set(cacheKey, products);
  res.json(products);
});

const fetchNewProducts = asyncHandler(async (req, res) => {
  const cacheKey = "fetchNewProducts";
  if (cache.has(cacheKey)) {
    return res.json(cache.get(cacheKey));
  }

  const products = await Product.find({}).lean().sort({ _id: -1 }).limit(5);
  cache.set(cacheKey, products);
  res.json(products);
});

const filterProducts = asyncHandler(async (req, res) => {
  const { checked = [], radio = [] } = req.body;

  let args = {};
  if (checked.length > 0) args.category = checked;
  if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

  const products = await Product.find(args).lean();
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
