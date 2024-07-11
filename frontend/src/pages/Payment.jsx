import React, { useRef } from "react";
import CheckoutSteps from "../components/CheckOutStape";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import EventIcon from "@mui/icons-material/Event";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router";
const Payment = () => {
  const navigate = useNavigate();
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  const stripe = useStripe();
  const elements = useElements();
  const payBtn = useRef(null);
  const user = useSelector((state) => state.user.user);
  const shippingInfo = useSelector((state) => state.shipping.shippingInfo);
  const cartItem = useSelector((state) => state.cart.carts);

  const paymentData = {
    amount: Math.round(orderInfo.totalPrice * 100),
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    payBtn.current.disabled = true;

    try {
      const { data } = await axios.post("/api/v1/payment/process", paymentData);

      const client_secret = data.client_secret;

      if (!stripe || !elements) return;

      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: user.username,
            email: user.email,
            address: {
              line1: shippingInfo.address,
              city: shippingInfo.city,
              state: shippingInfo.state,
              postal_code: shippingInfo.pinCode,
            },
          },
        },
      });
      if (result.error) {
        payBtn.current.disabled = false;
        alert(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          alert("Payment Successful");
          // update database
          const order = {
            orderItems: cartItem.map((product) => ({
              ...product,
              product: product._id,
            })),
            shippingInfo,
            user: user._id,
            paymentInfo: {
              id: result.paymentIntent.id,
              status: result.paymentIntent.status,
            },
            itemsPrice: orderInfo.TotalAmount,
            taxPrice: orderInfo.tax,
            shippingPrice: orderInfo.shippingCharges,
            totalPrice: orderInfo.totalPrice,
          };

          await axios.post("/api/v1/order/create-oreder", order);

          navigate("/success-order");

          payBtn.current.disabled = false;
        } else {
          alert.error("There's some issue while processing payment ");
        }
      }
    } catch (error) {
      payBtn.current.disabled = false;
      console.log(error);
    }
  };

  return (
    <div className="my-5">
      <CheckoutSteps activeStep={2} />

      <div className="flex justify-center items-center p-5">
        <div className="bg-white w-full md:w-3/4 lg:w-1/2 p-8 rounded-lg shadow-lg">
          <h2 className="text-center mb-5 text-2xl text-gray-700">
            Card Information
          </h2>

          <form className="flex flex-col" onSubmit={submitHandler}>
            <div className="flex items-center mb-4">
              <CreditCardIcon />
              <CardNumberElement className="flex-1 p-2 ml-2 border border-gray-300 rounded" />
            </div>

            <div className="flex items-center mb-4">
              <EventIcon />
              <CardExpiryElement className="flex-1 p-2 ml-2 border border-gray-300 rounded" />
            </div>

            <div className="flex items-center mb-4">
              <VpnKeyIcon />
              <CardCvcElement className="flex-1 p-2 ml-2 border border-gray-300 rounded" />
            </div>

            <input
              type="submit"
              ref={payBtn}
              className="bg-zinc-700 rounded-md text-white p-2 cursor-pointer disabled:bg-zinc-300"
              value="Pay Now"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payment;
