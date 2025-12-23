import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { apiSlice } from "./api/apiSlice.js";
import authReducer from "./features/auth/authSlice.js";
import favoritesReducer from "./features/favorites/favoriteSlice.js";
import cartSliceReducer from "./features/cart/cartSlice.js";
import shopReducer from "./features/shop/shopSlice.js";
import { getFavoritesFromLocalStorage } from "../utils/localstorage.js";

const initialFavorites = getFavoritesFromLocalStorage() || [];

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,

    auth: authReducer,
    favorites: favoritesReducer,
    cart: cartSliceReducer,
    shop: shopReducer,
  },

  preloadedState: {
    favorites: initialFavorites,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),

  devTools: true,
});

setupListeners(store.dispatch);
export default store;

// the useState  hook is used to manage state in  functional components it give us current state varibal end a function to update it

// state in react js is for managing dynamic data within a component like user input and changing ui elements keep everything  interactive and rendering efficiently when data change

// the useEffect hook is used to perform side effects in functional components like fetching data or subscribing to events it runs after the component renders and can be used to update state or perform cleanup tasks

//the difference between useState and useEffect is that useState is for managing state while useEffect is for handling side effects that occur after the component renders

//the difffernce between props and state in react js is that props are used to pass data from parent to child components while state is used to manage data within a component itself props are immutable and cannot be changed by the child component while state can be updated using the setState function

// we handle events in react js by attaching event handlers to elements using the onClick onChange or other event attributes these handlers are functions that are called when the event occurs allowing us to respond to user interactions like clicks or input changes
// react js is a popular javascript library for building user interfaces it allows developers to create reusable components that can efficiently update and render based on changes in data react uses a virtual dom to optimize rendering performance and provides a declarative syntax for defining ui elements

// react js use react router dom to handle routing in single-page applications it allows developers to define routes and navigate between different components based on the url using the BrowserRouter and Route components react router dom provides a way to manage navigation history and render components conditionally based on the current route
// react js uses redux for state management in larger applications it provides a centralized store to manage application state and allows components to access and update that state using actions and reducers redux helps maintain a predictable state flow and makes it easier to debug and test applications
// A react component is a piece of reusable code that defines a part of the user interface it can be a class-based component or a functional component components can accept props to receive data and can manage their own state using the useState hook or class-based state

// controlled components in react js use useState to mange their values and react-js handle the input changes through event handlers like onChnage which update the state and keep everything in sync and uncontrolled components use refs to access the input values directly without managing their state in react js controlled components are preferred for better control and validation of user input

//
