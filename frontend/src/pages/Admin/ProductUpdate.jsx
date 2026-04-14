import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import ImageCropper from "../../components/ImageCropper";

const BASE_URL = import.meta.env.VITE_BACKEND_URL; // make sure this is set in Vercel / .env

const AdminProductUpdate = () => {
  const params = useParams();
  const navigate = useNavigate();

  const { data: productData, isLoading } = useGetProductByIdQuery(params._id);
  const { data: categories = [] } = useFetchCategoriesQuery();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  // keep imageUrl (string) and optionally file (File) if you also want to upload directly
  const [image, setImage] = useState("");
  const [galleryUrls, setGalleryUrls] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState("");

  const [cropSrc, setCropSrc] = useState(null);
  const [isCropping, setIsCropping] = useState(false);

  // helper: convert product image (could be relative path or full cloudinary url)
  const normalizeImageUrl = (img) => {
    if (!img) return "";
    if (typeof img !== "string") return "";
    return img.startsWith("http") ? img : `${BASE_URL}${img}`;
  };

  useEffect(() => {
    if (productData && categories.length >= 0) {
      setImage(normalizeImageUrl(productData.image));
      setGalleryUrls(productData.images || []);
      setName(productData.name || "");
      setDescription(productData.description || "");
      setPrice(productData.price ?? "");
      const catId =
        typeof productData.category === "string"
          ? productData.category
          : productData.category?._id;
      setCategory(catId || "");
      setQuantity(productData.quantity ?? "");
      setBrand(productData.brand || "");
      setStock(productData.countInStock ?? "");
    }
  }, [productData, categories]);

  const validateForm = () => {
    // convert to numbers for numeric checks
    const priceN = Number(price);
    const quantityN = Number(quantity);
    const stockN = Number(stock);

    if (
      !name ||
      !price ||
      !description ||
      !category ||
      !quantity ||
      !brand ||
      stock === "" ||
      !image
    ) {
      toast.error("Please fill all required fields.");
      return false;
    }
    if (priceN <= 0 || quantityN <= 0 || stockN < 0) {
      toast.error("Price, Quantity, and Stock must be positive values.");
      return false;
    }
    return true;
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setCropSrc(url);
      setIsCropping(true);
      e.target.value = ""; // clear so we can pick exact same file again
    }
  };

  const handleCropCancel = () => {
    setIsCropping(false);
    setCropSrc(null);
  };

  const handleCropDone = async (croppedFile) => {
    try {
      setIsCropping(false);
      const formData = new FormData();
      formData.append("image", croppedFile);
      
      const res = await uploadProductImage(formData).unwrap();
      const uploadedUrl = res.image;
      toast.success("Image cropped and uploaded successfully!");

      if (!image) {
        setImage(uploadedUrl);
      } else {
        setGalleryUrls((prev) => [...prev, uploadedUrl]);
      }
    } catch (err) {
      toast.error(err?.data?.message || err.error || "Upload failed");
    } finally {
      setCropSrc(null);
    }
  };

  const handleRemoveCover = () => {
    if (galleryUrls.length > 0) {
      setImage(galleryUrls[0]);
      setGalleryUrls((prev) => prev.slice(1));
    } else {
      setImage("");
    }
  };

  const handleRemoveGallery = (idx) => {
    setGalleryUrls((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // must have image URL from uploadFileHandler
      if (!image || typeof image !== "string") {
        toast.error("Please upload an image first");
        return;
      }

      const formData = new FormData();

      // Send the Cloudinary URL as a text field so backend has it in req.fields.image
      formData.append("image", image);
      // optional: also send imageUrl as fallback key
      formData.append("imageUrl", image);

      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("quantity", quantity);
      formData.append("brand", brand);
      formData.append("countInStock", stock);
      if (galleryUrls.length > 0) {
        formData.append("images", JSON.stringify(galleryUrls));
      }

      // DEBUG: ensure image appears as text in formData
      for (let pair of formData.entries()) {
        console.log("formData:", pair[0], pair[1]);
      }

      // Pass FormData directly to RTK mutation (productApiSlice handles it)
      await updateProduct({ productId: params._id, formData }).unwrap();

      toast.success("Product successfully updated");
      navigate("/admin/allproductslist");
    } catch (err) {
      console.error("handleSubmit error:", err);
      toast.error("Product update failed. Try again.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      const { data } = await deleteProduct(params._id);
      toast.success(`"${data.name}" is deleted`);
      navigate("/admin/allproductslist");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed. Try again.");
    }
  };

  if (isLoading) return <div className="text-center mt-5 p-8 text-gray-500">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm rounded-xl">
      {isCropping && cropSrc && (
        <ImageCropper 
          imageSrc={cropSrc} 
          onCropDone={handleCropDone} 
          onCropCancel={handleCropCancel} 
        />
      )}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Update Product</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Modify or delete this product</p>
      </div>

        {/* Image Previews */}
        {(image || galleryUrls.length > 0) && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {image && (
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden border-2 border-emerald-500 shadow-xl group">
                <span className="absolute top-2 left-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded shadow-md z-10 w-fit">Cover Photo</span>
                <button 
                  type="button"
                  onClick={handleRemoveCover}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-md hover:bg-red-600 focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <img
                  src={image.startsWith("http") ? image : `${import.meta.env.VITE_BACKEND_URL || ""}${image}`}
                  alt="main"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {galleryUrls.map((url, index) => (
              <div key={index} className="relative aspect-[4/5] rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-sm opacity-90 group hover:opacity-100 transition-opacity">
                <button 
                  type="button"
                  onClick={() => handleRemoveGallery(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-md hover:bg-red-600 focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <img
                  src={url.startsWith("http") ? url : `${import.meta.env.VITE_BACKEND_URL || ""}${url}`}
                  alt={`gallery-${index}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

          <div className="mb-6">
            <label className="border-2 border-dashed border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 px-4 block w-full text-center rounded-xl cursor-pointer font-semibold py-12 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 hover:border-emerald-300 transition-colors">
              <span className="text-emerald-500 block mb-2 text-2xl">📸</span>
              Click to Upload Another Gallery Image
              <input
                type="file"
                name="images"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  className="p-3 w-full border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="price">Price</label>
                <input
                  type="number"
                  className="p-3 w-full border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="quantity">Quantity</label>
                <input
                  type="number"
                  className="p-3 w-full border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="brand">Brand</label>
                <input
                  type="text"
                  className="p-3 w-full border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="description">Description</label>
                <textarea
                  rows="3"
                  className="p-3 w-full border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="stock">Count In Stock</label>
                <input
                  type="number"
                  className="p-3 w-full border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="category">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="p-3 w-full border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                >
                  {categories?.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                type="submit"
                className="flex-1 py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors"
              >
                Update Product
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 py-3 px-6 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-colors"
              >
                Delete Product
              </button>
            </div>
          </form>
    </div>
  );
};

export default AdminProductUpdate;
