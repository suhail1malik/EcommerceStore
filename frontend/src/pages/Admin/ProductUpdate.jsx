import React, { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";

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
  // const [imageFile, setImageFile] = useState(null); // optional if you want local preview before upload
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState("");

  // helper: convert product image (could be relative path or full cloudinary url)
  const normalizeImageUrl = (img) => {
    if (!img) return "";
    if (typeof img !== "string") return "";
    return img.startsWith("http") ? img : `${BASE_URL}${img}`;
  };

  useEffect(() => {
    if (productData && categories.length >= 0) {
      setImage(normalizeImageUrl(productData.image));
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

  // upload file -> backend upload endpoint which returns the cloudinary URL
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Keep local preview if you want
    // setImageFile(file); // optional, used only for preview
    const fd = new FormData();
    fd.append("image", file);

    try {
      const res = await uploadProductImage(fd).unwrap();

      if (res.image) {
        setImage(res.image); // always Cloudinary URL string
        toast.success("Image uploaded successfully");
      }

      // backend returns imageUrl in your case — read robustly

      if (!image) {
        console.error("Upload response did not contain a URL:", res);
        toast.error("Upload succeeded but server did not return URL");
        return;
      }
    } catch (err) {
      console.error("uploadFileHandler error:", err);
      toast.error("Image upload failed");
    }
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

  if (isLoading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/4">
          <AdminMenu />
        </div>

        <div className="md:w-3/4 p-3">
          <h2 className="text-xl font-semibold mb-4">
            Update / Delete Product
          </h2>

          {image && (
            <div className="text-center mb-4">
              <img
                src={image}
                alt="product"
                className="block mx-auto w-full max-w-[300px] h-auto rounded-md shadow"
              />
            </div>
          )}

          <div className="mb-3">
            <label className="text-white py-2 block font-bold">
              Upload Image
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={uploadFileHandler}
                className="block mt-2"
              />
            </label>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  className="p-3 w-full border rounded-lg bg-[#101011] text-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="price">Price</label>
                <input
                  type="number"
                  className="p-3 w-full border rounded-lg bg-[#101011] text-white"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="quantity">Quantity</label>
                <input
                  type="number"
                  className="p-3 w-full border rounded-lg bg-[#101011] text-white"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="brand">Brand</label>
                <input
                  type="text"
                  className="p-3 w-full border rounded-lg bg-[#101011] text-white"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="description">Description</label>
                <textarea
                  rows="3"
                  className="p-3 w-full border rounded-lg bg-[#101011] text-white"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="stock">Count In Stock</label>
                <input
                  type="number"
                  className="p-3 w-full border rounded-lg bg-[#101011] text-white"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="category">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                >
                  {categories?.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
                type="submit"
                className="py-3 px-6 rounded-lg bg-green-600 text-white font-semibold"
              >
                Update
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="py-3 px-6 rounded-lg bg-pink-600 text-white font-semibold"
              >
                Delete
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProductUpdate;
