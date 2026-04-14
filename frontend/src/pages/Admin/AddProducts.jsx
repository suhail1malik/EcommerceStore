import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import ImageCropper from "../../components/ImageCropper";

const AddProducts = () => {
  const [image, setImage] = useState("");
  const [galleryUrls, setGalleryUrls] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);

  const [cropSrc, setCropSrc] = useState(null);
  const [isCropping, setIsCropping] = useState(false);

  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productData = new FormData();
      productData.append("image", image);
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("brand", brand);
      productData.append("countInStock", stock);
      if (galleryUrls.length > 0) {
        productData.append("images", JSON.stringify(galleryUrls));
      }

      const { data } = await createProduct(productData);

      if (data.error) {
        toast.error("Product create failed. Try Again.");
      } else {
        toast.success(`${data.name} is created`);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast.error("Product create failed. Try Again.");
    }
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Create Product</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Add a new product to your catalog</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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

        {/* Upload Image */}
        <div className="mb-6">
          <label className="border-2 border-dashed border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 px-4 block w-full text-center rounded-xl cursor-pointer font-semibold py-12 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 hover:border-emerald-300 transition-colors">
            <span className="text-emerald-500 block mb-2 text-2xl">📸</span>
            {image ? "Click to add another gallery image" : "Click to select a Cover Image"}
            <input
              type="file"
              name="images"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        </div>

        {/* Name & Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label>Name</label>
            <input
              type="text"
              className="p-3 w-full border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label>Price</label>
            <input
              type="number"
              className="p-3 w-full border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>

        {/* Quantity & Brand */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label>Quantity</label>
            <input
              type="number"
              className="p-3 w-full border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          <div>
            <label>Brand</label>
            <input
              type="text"
              className="p-3 w-full border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label>Description</label>
          <textarea
            className="p-3 w-full border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        {/* Count in Stock & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label>Count In Stock</label>
            <input
              type="number"
              className="p-3 w-full border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>
          <div>
            <label>Category</label>
            <select
              className="p-3 w-full border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">-- Select Category --</option>
              {categories?.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="py-4 px-10 mt-5 rounded-lg text-lg font-bold bg-emerald-600 hover:bg-emerald-700"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProducts;

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   useCreateProductMutation,
//   useUploadProductImageMutation,
// } from "../../redux/api/productApiSlice";
