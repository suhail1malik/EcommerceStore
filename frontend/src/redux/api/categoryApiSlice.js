import { apiSlice } from './apiSlice';
import { CATEGORY_URL } from '../constants';

export const categoryApiSlice = apiSlice.injectEndpoints({
   endpoints: (builder) => ({
      createCategory: builder.mutation({
        query: (newCategory) => ({
          url: `${CATEGORY_URL}`,
          method: 'POST',
          body: newCategory,
        }),
        invalidatesTags: ['Category'], // 🔥 Refetch category list
      }),

       updateCategory: builder.mutation({
      query: ({ categoryId, updatedCategory }) => ({
        url: `${CATEGORY_URL}/${categoryId}`,
        method: "PUT",
        body: updatedCategory,
      }),
      invalidatesTags: ['Category'], // 🔥 Refetch category list
    }),

    deleteCategory: builder.mutation({
      query: (categoryId) => ({
        url: `${CATEGORY_URL}/${categoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: ['Category'], // 🔥 Refetch category list
    }),

    fetchCategories: builder.query({
      query: () => `${CATEGORY_URL}/categories`,
       providesTags: ['Category'], // 💡 This marks it for refresh
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} = categoryApiSlice;