import React from 'react';
import  { useState } from "react";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} from "../../redux/api/categoryApiSlice";
import { useUploadProductImageMutation } from "../../redux/api/productApiSlice";

import { toast } from "react-toastify";
import CategoryForm from "../../components/CategoryForm";
import Modal from "../../components/Modal";

const CategoryList = () => {
  const { data: categories } = useFetchCategoriesQuery();
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [updatingImage, setUpdatingImage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [uploadProductImage, { isLoading: isUploading }] = useUploadProductImageMutation();

  const handleFileSelect = async (e, setImageState) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("image", file);
      try {
        const res = await uploadProductImage(formData).unwrap();
        setImageState(res.image);
        toast.success("Image uploaded successfully!");
      } catch (err) {
        toast.error(err?.data?.message || err.error || "Upload failed");
      }
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();

    if (!name) {
      toast.error("Category name is required");
      return;
    }

    try {
      const result = await createCategory({ name, image }).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        setName("");
        setImage("");
        toast.success(`${result.name} is created.`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Creating category failed, try again.");
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();

    if (!updatingName) {
      toast.error("Category name is required");
      return;
    }

    try {
      const result = await updateCategory({
        categoryId: selectedCategory._id,
        updatedCategory: {
          name: updatingName,
          image: updatingImage,
        },
      }).unwrap();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} is updated`);
        setSelectedCategory(null);
        setUpdatingName("");
        setUpdatingImage("");
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteCategory = async () => {
    try {
      const result = await deleteCategory(selectedCategory._id).unwrap();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} is deleted.`);
        setSelectedCategory(null);
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Category delection failed. Tray again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
      <div className="w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Manage Categories</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Create, update, or delete product categories</p>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm mb-8">
          <CategoryForm
            value={name}
            setValue={setName}
            imageValue={image}
            setImageValue={setImage}
            isUploading={isUploading}
            onImageSelect={(e) => handleFileSelect(e, setImage)}
            handleSubmit={handleCreateCategory}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories?.map((category) => (
            <div key={category._id} className="relative group cursor-pointer" onClick={() => {
              setModalVisible(true);
              setSelectedCategory(category);
              setUpdatingName(category.name);
              setUpdatingImage(category.image || "");
            }}>
              {category.image ? (
                <div className="aspect-square rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 group-hover:border-emerald-500 transition-colors shadow-sm relative">
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                     <span className="text-white font-bold">Edit</span>
                  </div>
                  <img src={category.image.startsWith("http") ? category.image : `${import.meta.env.VITE_BACKEND_URL || ""}${category.image}`} alt={category.name} className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8">
                    <span className="text-white font-bold block truncate">{category.name}</span>
                  </div>
                </div>
              ) : (
                <button
                  className="w-full h-full min-h-[100px] bg-white dark:bg-slate-800 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-medium py-2 px-4 rounded-xl hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-500 dark:hover:text-white transition-all focus:outline-none shadow-sm flex items-center justify-center break-words"
                >
                  {category.name}
                </button>
              )}
            </div>
          ))}
        </div>

        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Edit Category</h2>
          </div>
          <CategoryForm
            value={updatingName}
            setValue={(value) => setUpdatingName(value)}
            imageValue={updatingImage}
            setImageValue={setUpdatingImage}
            isUploading={isUploading}
            onImageSelect={(e) => handleFileSelect(e, setUpdatingImage)}
            handleSubmit={handleUpdateCategory}
            buttonText="Update"
            handleDelete={handleDeleteCategory}
          />
        </Modal>
      </div>
    </div>
  );
};

export default CategoryList;