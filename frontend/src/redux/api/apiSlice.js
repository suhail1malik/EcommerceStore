// frontend/src/redux/api/apiSlice.js
import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include", // keep if you need cookies/auth
  prepareHeaders: (headers, { getState }) => {
    // Add auth token if present — do NOT set Content-Type here.
    const token = getState().auth?.token || getState().user?.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    // Important: do NOT call headers.set('Content-Type', ...) for multipart requests.
    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["Product", "User", "Order", "Category"],
  endpoints: () => ({}),
});
