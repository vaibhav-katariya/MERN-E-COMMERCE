import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Profile from "./pages/Profile.jsx";
import { store, persistor } from "./store/store.js";
import Settings from "./pages/Settings.jsx";
import UpdatePassword from "./components/UpdatePassword.jsx";
import UpdateUser from "./components/UpdateUser.jsx";
import UserProfile from "./components/UserProfile.jsx";
import UploadProduct from "./components/UploadProduct.jsx";
import GetAllProduct from "./components/GetAllProduct.jsx";
import ProductDetails from "./components/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="" element={<App />}>
      <Route path="*" element={<div>Not Found</div>} />
      <Route path="/" element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path="profile" element={<Profile />}>
        <Route path="userProfile" element={<UserProfile />} />
        <Route path="uploadProduct" element={<UploadProduct />} />
        <Route path="getAllProduct" element={<GetAllProduct />} />
      </Route>
      <Route path="setting" element={<Settings />}>
        <Route path="changePassword" element={<UpdatePassword />} />
        <Route path="changeUserDetails" element={<UpdateUser />} />
      </Route>
      <Route path="productDetails/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
