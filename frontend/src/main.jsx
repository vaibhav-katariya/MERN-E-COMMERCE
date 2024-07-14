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
import ProtectedRoute from "./helpers/ProtectedRoute.jsx";
import Alluser from "./components/Alluser.jsx";
import ProtectedAdmin from "./helpers/ProtectedAdmin.jsx";
import SearchProducts from "./components/SearchProducts.jsx";
import Shipping from "./pages/Shipping.jsx";
import ConfirmOrder from "./pages/ConfirmOrder.jsx";
import Payment from "./pages/Payment.jsx";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentSuccesss from "./pages/PaymentSuccesss.jsx";
import MyOrders from "./components/MyOrders.jsx";
import OrderDetails from "./components/OrderDetails.jsx";
import AllOrders from "./components/AllOrders.jsx";
import ProccessOrder from "./components/ProccessOrder.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="" element={<App />}>
      <Route path="*" element={<div>Not Found</div>} />
      <Route path="/" element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route
        path="profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      >
        <Route
          path="userProfile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="uploadProduct"
          element={
            <ProtectedRoute>
              <UploadProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="getAllProduct"
          element={
            <ProtectedRoute>
              <GetAllProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="alluser"
          element={
            <ProtectedAdmin>
              <Alluser />
            </ProtectedAdmin>
          }
        />
        <Route
          path="allorders"
          element={
            <ProtectedAdmin>
              <AllOrders />
            </ProtectedAdmin>
          }
        />
        <Route
          path="myOrders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* setting */}

      <Route
        path="setting"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      >
        <Route
          path="changePassword"
          element={
            <ProtectedRoute>
              <UpdatePassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="changeUserDetails"
          element={
            <ProtectedRoute>
              <UpdateUser />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route
        path="order/:id"
        element={
          <ProtectedAdmin>
            <ProccessOrder />
          </ProtectedAdmin>
        }
      />
      <Route path="productDetails/:id" element={<ProductDetails />} />
      <Route path="OrderDetails/:id" element={<OrderDetails />} />
      <Route path="search/:keyword" element={<SearchProducts />} />
      <Route
        path="cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />
      <Route
        path="shipping"
        element={
          <ProtectedRoute>
            <Shipping />
          </ProtectedRoute>
        }
      />
      <Route
        path="confirm-order"
        element={
          <ProtectedRoute>
            <ConfirmOrder />
          </ProtectedRoute>
        }
      />

      <Route
        path="payment"
        element={
          <Elements stripe={loadStripe(import.meta.env.VITE_STRIPE_API_KEY)}>
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          </Elements>
        }
      />

      <Route
        path="success-order"
        element={
          <ProtectedRoute>
            <PaymentSuccesss />
          </ProtectedRoute>
        }
      />
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
