// frontend/src/redux/api/productApiSlice.js
import { apiSlice } from "./apiSlice"; // your base apiSlice (fetchBaseQuery)
import { PRODUCT_URL, UPLOAD_URL } from "../constants";

/**
 * productApiSlice
 * - All multipart/form-data requests send FormData as body directly.
 * - Do NOT set Content-Type headers here.
 * - Ensure your apiSlice.prepareHeaders does not set 'Content-Type'.
 */

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ----- Queries -----
    getProducts: builder.query({
      query: ({ keyword = "" } = {}) => ({
        url: `${PRODUCT_URL}`,
        params: { keyword },
      }),
      keepUnusedDataFor: 5,
      providesTags: (result) =>
        result
          ? [
              ...result.products.map((p) => ({ type: "Product", id: p._id })),
              { type: "Products", id: "LIST" },
            ]
          : [{ type: "Products", id: "LIST" }],
    }),

    getProductById: builder.query({
      query: (productId) => `${PRODUCT_URL}/${productId}`,
      providesTags: (result, error, productId) => [
        { type: "Product", id: productId },
      ],
    }),

    allProducts: builder.query({
      query: () => `${PRODUCT_URL}/allproducts`,
      providesTags: ["Products"],
    }),

    getProductDetails: builder.query({
      query: (productId) => `${PRODUCT_URL}/${productId}`,
      keepUnusedDataFor: 5,
      providesTags: (result, error, productId) => [
        { type: "Product", id: productId },
      ],
    }),

    getTopProducts: builder.query({
      query: () => `${PRODUCT_URL}/top`,
      keepUnusedDataFor: 5,
    }),

    getNewProducts: builder.query({
      query: () => `${PRODUCT_URL}/new`,
      keepUnusedDataFor: 5,
    }),

    getFilteredProducts: builder.query({
      query: ({ checked = [], radio = [] } = {}) => ({
        url: `${PRODUCT_URL}/filtered-products`,
        method: "POST",
        body: { checked, radio },
      }),
    }),

    // ----- Mutations -----
    createProduct: builder.mutation({
      /**
       * productData should be a FormData instance (for multipart).
       * Example:
       * const formData = new FormData();
       * formData.append('name', name);
       * formData.append('image', fileOrUrl); // file or url string
       */
      query: (productData) => ({
        url: `${PRODUCT_URL}`,
        method: "POST",
        body: productData, // FormData
      }),
      invalidatesTags: [{ type: "Products", id: "LIST" }],
    }),

    updateProduct: builder.mutation({
      /**
       * call with: updateProduct({ productId, formData })
       * where formData is a FormData instance.
       */
      query: ({ productId, formData }) => ({
        url: `${PRODUCT_URL}/${productId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { productId } = {}) =>
        productId
          ? [
              { type: "Product", id: productId },
              { type: "Products", id: "LIST" },
            ]
          : [{ type: "Products", id: "LIST" }],
    }),

    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCT_URL}/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, productId) =>
        productId
          ? [
              { type: "Product", id: productId },
              { type: "Products", id: "LIST" },
            ]
          : [{ type: "Products", id: "LIST" }],
    }),

    uploadProductImage: builder.mutation({
      /**
       * upload endpoint expects FormData with key 'image' (file).
       * Example:
       * const fd = new FormData();
       * fd.append('image', file);
       */
      query: (formData) => ({
        url: `${UPLOAD_URL}`, // e.g. '/api/products/upload' or whatever your backend route is
        method: "POST",
        body: formData,
      }),
      transformResponse: (response) => {
        // Normalize so your component always gets res.image
        return {
          image: response.image || response.imageUrl || response.secure_url,
        };
      },
    }),

    createReview: builder.mutation({
      query: (data) => ({
        url: `${PRODUCT_URL}/${data.productId}/reviews`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, data) =>
        data?.productId ? [{ type: "Product", id: data.productId }] : [],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useAllProductsQuery,
  useGetProductDetailsQuery,
  useGetTopProductsQuery,
  useGetNewProductsQuery,
  useGetFilteredProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadProductImageMutation,
  useCreateReviewMutation,
} = productApiSlice;
