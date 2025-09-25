// backend/controllers/productController.js
import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import cloudinary from "../config/cloudinary.js"; // make sure this exists and reads env

const uploadToCloudinary = async (filePath, folder = "ecommerce_products") => {
  // cloudinary.uploader.upload accepts a file path
  const result = await cloudinary.uploader.upload(filePath, { folder });
  return result; // contains secure_url, public_id, etc.
};

const addProduct = asyncHandler(async (req, res) => {
  // express-formidable puts text fields in req.fields and files in req.files
  const { name, description, price, category, quantity, brand } = req.fields;

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
    // fallback: upload temp file to Cloudinary
    const uploadResult = await uploadToCloudinary(req.files.image.path);
    image = uploadResult.secure_url;
  }

  const product = new Product({
    ...req.fields,
    image: image || "/uploads/default-product.jpg",
  });

  await product.save();
  res.status(201).json(product);
});

const updateProductDetails = asyncHandler(async (req, res) => {
  const { name, description, price, category, quantity, brand } = req.fields;

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

  res.json(product);
});

const removeProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.json(product);
});

const fetchProducts = asyncHandler(async (req, res) => {
  const pageSize = 6;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .skip(pageSize * (page - 1))
    .limit(pageSize);

  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
    hasMore: page * pageSize < count,
  });
});

const fetchProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.json(product);
});

const fetchAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({})
    .populate("category")
    .limit(12)
    .sort({ createdAt: -1 }); // fixed field name
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

  const review = {
    name: req.user.username,
    rating: Number(rating),
    comment,
    user: req.user._id,
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save();
  res.status(201).json({ message: "Review added" });
});

const fetchTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(4);
  res.json(products);
});

const fetchNewProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ _id: -1 }).limit(5);
  res.json(products);
});

const filterProducts = asyncHandler(async (req, res) => {
  const { checked = [], radio = [] } = req.body;

  let args = {};
  if (checked.length > 0) args.category = checked;
  if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

  const products = await Product.find(args);
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
