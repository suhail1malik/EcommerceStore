import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [],
  products: [],
  checked: [],
  radio: [],
  brandCheckboxes: {},
  checkedBrands: [],
}
const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setChecked: (state, action) => {
      state.checked = action.payload;
    },
    setRadio: (state, action) => {
      state.radio = action.payload;
    },
    setBrandCheckboxes: (state, action) => {
      state.brandCheckboxes = action.payload;
    },
  },
})
export const {
  setCategories, 
  setProducts,
  setChecked,
  setRadio,
  setSelectedBrand,
} = shopSlice.actions;
export const selectShop = (state) => state.shop;
export default shopSlice.reducer;