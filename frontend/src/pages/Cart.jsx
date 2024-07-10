import React from "react";
import CartItem from "../components/CartItem";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
const Cart = () => {
  const { carts, TotalAmount } = useSelector((state) => state.cart);

  return (
    <>
      {carts?.map((item, index) => (
        <CartItem item={item} key={index} />
      ))}
      {carts.length > 0 ? (
        <div className="w-[70%] mx-auto">
          <div className="border-t-[1px] pt-3 flex flex-col md:flex-row items-center md:items-center justify-between lg:px-6 pb-6 border-b border-gray-200 max-lg:max-w-lg max-lg:mx-auto">
            <h5 className="text-gray-900 font-manrope font-semibold text-2xl leading-9 w-full max-md:text-center max-md:mb-4">
              SubTotal
            </h5>
            <div className="flex items-center justify-between gap-5 ">
              <h6 className="font-manrope font-bold text-3xl lead-10 text-zinc-600">
                ${TotalAmount}
              </h6>
            </div>
          </div>
          <div className="max-lg:max-w-lg max-lg:mx-auto">
            <p className="font-normal text-base leading-7 text-gray-500 text-center mb-5 mt-6">
              Shipping taxes, and discounts calculated at checkout
            </p>
            <Link to={"/shipping"}>
              <button className="rounded-2xl py-2 px-5 bg-zinc-700 text-white font-semibold text-lg w-full text-center transition-all duration-500 hover:bg-zinc-800 ">
                Checkout
              </button>
            </Link>
          </div>
        </div>
      ) : (
        "NO ITEMS IN THE CART"
      )}
    </>
  );
};

export default Cart;
