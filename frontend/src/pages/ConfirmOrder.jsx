import React from "react";
import CheckoutSteps from "../components/CheckOutStape";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";

const ConfirmOrder = () => {
  const shippingInfo = useSelector((state) => state.shipping.shippingInfo);
  const { carts, TotalAmount } = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate()

  const shippingCharges = TotalAmount > 1000 ? 0 : 200;

  const tax = TotalAmount * 0.18;

  const totalPrice = TotalAmount + tax + shippingCharges;

  const address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.pinCode}, ${shippingInfo.country}`;

  const proceedToPayment = () => {
    const data = {
      TotalAmount,
      shippingCharges,
      tax,
      totalPrice,
    };

    sessionStorage.setItem("orderInfo", JSON.stringify(data));
    navigate("/payment")
  };

  return (
    <div className="my-5 mx-2">
      <CheckoutSteps activeStep={1} />

      <section className="py-16 relative">
        <div className="w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto">
          <div className="flex items-start flex-col gap-6 xl:flex-row ">
            <div className="w-full max-w-sm md:max-w-3xl xl:max-w-sm flex items-start flex-col gap-8 max-xl:mx-auto">
              <div className="p-6 border border-gray-200 rounded-3xl w-full group transition-all duration-500 hover:border-gray-400 ">
                <h2 className="font-manrope font-bold text-3xl leading-10 text-black pb-6 border-b border-gray-200 ">
                  Order Summary
                </h2>
                <div className="data py-6 border-b border-gray-200">
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <p className="font-normal text-lg leading-8 text-gray-400 transition-all duration-500 group-hover:text-gray-700">
                      Product Cost
                    </p>
                    <p className="font-medium text-lg leading-8 text-gray-900">
                      ${TotalAmount}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <p className="font-normal text-lg leading-8 text-gray-400 transition-all duration-500 group-hover:text-gray-700">
                      Shipping
                    </p>
                    <p className="font-medium text-lg leading-8 text-gray-600">
                      ${shippingCharges}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-4 ">
                    <p className="font-normal text-lg leading-8 text-gray-400 transition-all duration-500 group-hover:text-gray-700 ">
                      GST
                    </p>
                    <p className="font-medium text-lg leading-8 text-gray-600">
                      ${tax}
                    </p>
                  </div>
                </div>
                <div className="total flex items-center justify-between pt-6">
                  <p className="font-normal text-xl leading-8 text-black ">
                    Total
                  </p>
                  <h5 className="font-manrope font-bold text-2xl leading-9 text-zinc-600">
                    ${totalPrice}
                  </h5>
                </div>
              </div>
            </div>
            <div className="w-full max-w-sm md:max-w-3xl max-xl:mx-auto">
              <div className="mb-5">
                <h2 className="font-bold mt-2 mb-4 text-2xl">Shipping Info</h2>
                <div className="confirmshippingAreaBox">
                  <div className="flex my-2 gap-2">
                    <p>Name:</p>
                    <span>{user.username}</span>
                  </div>
                  <div className="flex my-2 gap-2">
                    <p>Phone:</p>
                    <span>{shippingInfo.phoneNo}</span>
                  </div>
                  <div className="flex my-2 gap-2">
                    <p>Address:</p>
                    <span>{address}</span>
                  </div>
                </div>
              </div>
              <div className="h-[12rem] overflow-y-auto scrollbar-none">
                {carts?.map((item, index) => (
                  <Link
                  key={item._id}
                    to={`/productDetails/${item._id}`}
                    className="grid grid-cols-3 w-full border-[2px] my-2 p-2 rounded-2xl gap-8"
                  >
                    <div>
                      <img
                        className="h-[5rem] w-[5rem] object-contain"
                        src={item.image}
                        alt="img"
                      />
                    </div>
                    <div className="">
                      <h2 className="font-medium text-xl leading-8 text-black mb-1">
                        {item.title}
                      </h2>
                      <p className="font-normal text-lg leading-8 text-gray-500 ">
                        {item.category}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-8">
                      <h6 className="font-medium text-xl leading-8 text-zinc-600">
                        ({item.quantity} X ${item.price}) = ${item.price}
                      </h6>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <button
        className="px-3  w-[100%] md:w-[90%] mx-auto py-2 flex justify-center items-center bg-zinc-800 text-white text-semibold rounded-md"
        onClick={proceedToPayment}
      >
        Proceed To Payment
      </button>
    </div>
  );
};

export default ConfirmOrder;
