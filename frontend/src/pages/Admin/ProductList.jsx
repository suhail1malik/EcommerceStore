import React from 'react';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";

const ProductList = () => {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
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

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    try {
      const res = await uploadProductImage(formData).unwrap();
    

      toast.success(res.message);

      const imageFullPath = `${import.meta.env.VITE_BACKEND_URL}${res.image}`;
      setImage(res.image);
      setImageUrl(imageFullPath);

    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <div className="p-3 lg:ml-[16rem] lg:mr-[12rem]">
      <AdminMenu />
  <form onSubmit={handleSubmit} className="space-y-4">
    {/* Image Preview */}
    {imageUrl && (
      <div className="text-center">
        <img
          src={imageUrl}
          alt="product"
          className="block mx-auto max-h-[200px] mb-4"
        />
      </div>
    )}

    {/* Upload Image */}
    <div className="mb-3">
      <label className="border text-white px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11">
        {image ? image.name : "Upload Image"}
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={uploadFileHandler}
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
          className="p-3 w-full border rounded-lg bg-[#101011] text-white"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label>Price</label>
        <input
          type="number"
          className="p-3 w-full border rounded-lg bg-[#101011] text-white"
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
          className="p-3 w-full border rounded-lg bg-[#101011] text-white"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </div>
      <div>
        <label>Brand</label>
        <input
          type="text"
          className="p-3 w-full border rounded-lg bg-[#101011] text-white"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />
      </div>
    </div>

    {/* Description */}
    <div>
      <label>Description</label>
      <textarea
        className="p-3 w-full border rounded-lg bg-[#101011] text-white"
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
          className="p-3 w-full border rounded-lg bg-[#101011] text-white"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
      </div>
      <div>
        <label>Category</label>
        <select
          className="p-3 w-full border rounded-lg bg-[#101011] text-white"
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
        className="py-4 px-10 mt-5 rounded-lg text-lg font-bold bg-pink-600 hover:bg-pink-700"
      >
        Submit
      </button>
    </div>
  </form>
</div>

  );
};

export default ProductList;