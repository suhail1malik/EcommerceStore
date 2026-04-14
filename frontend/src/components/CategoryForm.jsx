import React from "react";

const CategoryForm = ({
  value,
  setValue,
  imageValue,
  setImageValue,
  isUploading,
  onImageSelect,
  handleSubmit,
  buttonText = "Submit",
  handleDelete,
}) => {
  return (
    <div className="p-1">
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Image Upload Area */}
        <div className="mb-4">
          {imageValue ? (
            <div className="relative mb-3 flex justify-center">
              <img 
                src={imageValue.startsWith("http") ? imageValue : `${import.meta.env.VITE_BACKEND_URL || ""}${imageValue}`} 
                alt="Category" 
                className="w-32 h-32 object-cover rounded-xl border-2 border-emerald-500 shadow-lg"
              />
              <button 
                type="button"
                onClick={() => setImageValue("")}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 focus:outline-none z-10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ) : (
            <label className="border-2 border-dashed border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 px-4 block w-full text-center rounded-xl cursor-pointer font-semibold py-8 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 hover:border-emerald-300 transition-colors">
              <span className="text-emerald-500 block mb-2 text-3xl">📸</span>
              {isUploading ? "Uploading..." : "Click to select a Category Image"}
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={onImageSelect}
                className="hidden"
                disabled={isUploading}
              />
            </label>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Category Name</label>
          <input
            type="text"
            className="py-3 px-4 border border-gray-300 dark:border-slate-600 rounded-lg w-full bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
            placeholder="Write category name"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>

        <div className="flex justify-between items-center pt-2">
          <button 
            type="submit"
            disabled={isUploading}
            className="bg-emerald-600 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50 transition-colors disabled:opacity-50 shadow-md shadow-emerald-500/20"
          >
            {buttonText}
          </button>

          {handleDelete && (
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-500 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors shadow-md shadow-red-500/20"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;