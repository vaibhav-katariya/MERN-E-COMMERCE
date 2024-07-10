import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { addcart, deletecart, decrease } from "../store/cartSlice";

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  const handleDelete = (id) => {
    dispatch(deletecart(id));
  };

  const addItem = (item) => {
    dispatch(addcart(item));
  };

  const decreaseItem = (id) => {
    dispatch(decrease(id));
  };
  return (
    <div className="mx-3 md:mx-0 flex justify-center my-2">
      <div className=" rounded-3xl items-center gap-2 border-2 border-gray-200 p-4 lg:p-8 grid grid-cols-12 mb-8 max-lg:max-w-lg max-lg:mx-auto md:w-[70%]">
        <Link
          to={`/productDetails/${item._id}`}
          className="col-span-2 lg:col-span-1 img box"
        >
          <img
            src={item.image}
            alt="speaker image"
            className="max-lg:w-full h-full lg:w-[180px] "
          />
        </Link>
        <div className="col-span-10 lg:col-span-10 detail w-full lg:pl-3">
          <div className="flex items-center justify-between w-full">
            <h5 className="font-manrope font-bold text-xl leading-9 text-gray-900">
              {item.title}
            </h5>
            <button
              onClick={() => handleDelete(item._id)}
              className="rounded-full group flex items-center justify-center focus-within:outline-red-500"
            >
              <svg
                width={34}
                height={34}
                viewBox="0 0 34 34"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  className="fill-red-50 transition-all duration-500 group-hover:fill-red-400"
                  cx={17}
                  cy={17}
                  r={17}
                  fill=""
                />
                <path
                  className="stroke-red-500 transition-all duration-500 group-hover:stroke-white"
                  d="M14.1673 13.5997V12.5923C14.1673 11.8968 14.7311 11.333 15.4266 11.333H18.5747C19.2702 11.333 19.834 11.8968 19.834 12.5923V13.5997M19.834 13.5997C19.834 13.5997 14.6534 13.5997 11.334 13.5997C6.90804 13.5998 27.0933 13.5998 22.6673 13.5997C21.5608 13.5997 19.834 13.5997 19.834 13.5997ZM12.4673 13.5997H21.534V18.8886C21.534 20.6695 21.534 21.5599 20.9807 22.1131C20.4275 22.6664 19.5371 22.6664 17.7562 22.6664H16.2451C14.4642 22.6664 13.5738 22.6664 13.0206 22.1131C12.4673 21.5599 12.4673 20.6695 12.4673 18.8886V13.5997Z"
                  stroke="#EF4444"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button
                onClick={() => decreaseItem(item._id)}
                className="group rounded-[50px] border border-gray-200 shadow-sm shadow-transparent p-1.5 flex items-center justify-center bg-white transition-all duration-500 hover:shadow-gray-200 hover:bg-gray-50 hover:border-gray-300 focus-within:outline-gray-300"
              >
                <svg
                  className="stroke-gray-900 transition-all duration-500 group-hover:stroke-black"
                  width={18}
                  height={19}
                  viewBox="0 0 18 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.5 9.5H13.5"
                    stroke=""
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <input
                type="text"
                id="number"
                className="border border-gray-200 rounded-full w-8 aspect-square outline-none text-gray-900 font-semibold text-sm py-1.5 px-2 bg-gray-100  text-center"
                placeholder={item.quantity}
              />
              <button
                onClick={() => addItem(item)}
                className="group rounded-[50px] border border-gray-200 shadow-sm shadow-transparent p-1.5 flex items-center justify-center bg-white transition-all duration-500 hover:shadow-gray-200 hover:bg-gray-50 hover:border-gray-300 focus-within:outline-gray-300"
              >
                <svg
                  className="stroke-gray-900 transition-all duration-500 group-hover:stroke-black"
                  width={18}
                  height={19}
                  viewBox="0 0 18 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.75 9.5H14.25M9 14.75V4.25"
                    stroke=""
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <h6 className="text-zinc-600 font-manrope font-bold text-2xl leading-9 text-right">
              ${item.price * item.quantity}
            </h6>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
