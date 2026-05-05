import React, { useState } from "react";
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
  const [isDragging, setIsDragging] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [isTopRated, setIsTopRated] = useState(false);

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
      productData.append("isTopRated", isTopRated);
      if (galleryUrls.length > 0) {
        productData.append("images", JSON.stringify(galleryUrls));
      }

      const { data } = await createProduct(productData);

      if (data.error) {
        toast.error("Manifest initialization failed. Try Again.");
      } else {
        toast.success(`Product ${data.name} initialized in catalog`);
        navigate("/admin/all-products");
      }
    } catch (error) {
      console.error(error);
      toast.error("Operation failed.");
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setCropSrc(url);
      setIsCropping(true);
      e.target.value = ""; 
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect({ target: { files: e.dataTransfer.files, value: "" } });
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
      toast.success("Asset processed and uploaded.");

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
    setGalleryUrls((prev) => prev.slice(0, idx).concat(prev.slice(idx + 1)));
  };

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-8">
      {isCropping && cropSrc && (
        <ImageCropper 
          imageSrc={cropSrc} 
          onCropDone={handleCropDone} 
          onCropCancel={handleCropCancel} 
        />
      )}
      
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight italic font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
          Inventory Initialization
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Add high-fidelity assets and metadata to the global catalog.</p>
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Form Data */}
        <div className="lg:col-span-8 space-y-6">
          <div className="premium-card rounded-[32px] p-8 space-y-6">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2 ml-1">Asset Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-5 py-4 border-2 border-slate-200 dark:border-slate-700/50 rounded-2xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400"
                    placeholder="Minimalist Watch"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2 ml-1">Acquisition Price</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-bold">₹</span>
                    <input
                      type="number"
                      required
                      className="w-full pl-10 pr-5 py-4 border-2 border-slate-200 dark:border-slate-700/50 rounded-2xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                </div>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2 ml-1">Stock Quantities</label>
                  <input
                    type="number"
                    required
                    className="w-full px-5 py-4 border-2 border-slate-200 dark:border-slate-700/50 rounded-2xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2 ml-1">Brand Signature</label>
                  <input
                    type="text"
                    required
                    className="w-full px-5 py-4 border-2 border-slate-200 dark:border-slate-700/50 rounded-2xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400"
                    placeholder="Luxe Essentials"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  />
                </div>
             </div>

             <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2 ml-1">Editorial Description</label>
                <textarea
                  className="w-full px-5 py-4 border-2 border-slate-200 dark:border-slate-700/50 rounded-2xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all min-h-[150px] placeholder:text-slate-400"
                  placeholder="Detailed narrative about the product aesthetic and utility..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2 ml-1">Initial Reserve</label>
                  <input
                    type="number"
                    className="w-full px-5 py-4 border-2 border-slate-200 dark:border-slate-700/50 rounded-2xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2 ml-1">Category Classification</label>
                  <select
                    required
                    className="w-full px-5 py-4 border-2 border-slate-200 dark:border-slate-700/50 rounded-2xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all cursor-pointer"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">-- Unclassified --</option>
                    {categories?.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
             </div>

             <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                <input
                  type="checkbox"
                  id="isTopRated"
                  checked={isTopRated}
                  onChange={(e) => setIsTopRated(e.target.checked)}
                  className="w-5 h-5 text-emerald-600 rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-emerald-500/20"
                />
                <label htmlFor="isTopRated" className="text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  Mark as <span className="text-emerald-500 uppercase tracking-widest text-[10px] ml-1 font-black">Top Rated Product</span>
                </label>
             </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-[0.2em] py-5 rounded-2xl transition-all shadow-xl shadow-emerald-600/20 active:scale-95 text-sm"
          >
            Initialize Product Manifest
          </button>
        </div>

        {/* Right Column - Media */}
        <div className="lg:col-span-4 space-y-6">
          <div className="premium-card rounded-[32px] p-6">
             <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">Visual Assets</h3>
             
             {/* Main Image Dropzone */}
             <label 
               onDragOver={handleDragOver}
               onDragLeave={handleDragLeave}
               onDrop={handleDrop}
               className={`relative border-2 border-dashed rounded-[24px] cursor-pointer aspect-square flex flex-col items-center justify-center transition-all group overflow-hidden ${
                 isDragging 
                   ? "border-emerald-500 bg-emerald-500/5 scale-105" 
                   : "border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/50"
               }`}
             >
               <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
               
               {image ? (
                 <div className="absolute inset-0">
                    <img
                      src={image.startsWith("http") ? image : `${import.meta.env.VITE_BACKEND_URL || ""}${image}`}
                      alt="Preview"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs uppercase tracking-widest">
                       Replace Cover
                    </div>
                 </div>
               ) : (
                 <div className="text-center p-6">
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/20 text-emerald-500 transition-transform group-hover:scale-110">
                       <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 00-2 2z" /></svg>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Primary Cover Asset</p>
                    <p className="text-[8px] text-slate-400 mt-1 uppercase">Click or Drag & Drop</p>
                 </div>
               )}
             </label>

             {/* Gallery Grid */}
             <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                   <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Supporting Media ({galleryUrls.length})</h4>
                </div>
                <div className="grid grid-cols-3 gap-3">
                   {galleryUrls.map((url, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 group">
                         <img 
                           src={url.startsWith("http") ? url : `${import.meta.env.VITE_BACKEND_URL || ""}${url}`} 
                           className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-500"
                           alt={`Gallery ${idx}`} 
                         />
                         <button 
                           type="button"
                           onClick={() => handleRemoveGallery(idx)}
                           className="absolute top-1 right-1 bg-rose-500 text-white rounded-lg p-1 opacity-0 group-hover:opacity-100 transition-all scale-75"
                         >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                         </button>
                      </div>
                   ))}
                   <label className="aspect-square rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center cursor-pointer hover:border-emerald-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all text-slate-400 hover:text-emerald-500">
                      <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                   </label>
                </div>
             </div>
          </div>

          <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-[24px]">
             <h4 className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2">Protocol Advice</h4>
             <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
               Ensure all images are high-resolution (min 1200px) and descriptions follow the brand's editorial tone for maximum impact.
             </p>
          </div>
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
