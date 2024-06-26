import React, { useEffect, useRef, useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";

const VerticalCardProduct = ({ category, heading }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadingList = new Array(13).fill(null);
  const dispatch = useDispatch();
  const scrollElement = useRef();

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    try {
      console.log(product);
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchData = async () => {
    const categoryProduct = await axios.get(
      `/api/v1/product/getProductsByCategory/${category}`
    );
    setLoading(false);
    setData(categoryProduct?.data?.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const scrollRight = () => {
    scrollElement.current.scrollTo({
      left: scrollElement.current.scrollLeft + 300,
      behavior: "smooth",
    });
  };

  const scrollLeft = () => {
    scrollElement.current.scrollTo({
      left: scrollElement.current.scrollLeft - 300,
      behavior: "smooth",
    });
  };

  return (
    <div className="container mx-auto px-4 my-6 relative">
      <h2 className="text-2xl font-semibold py-4 text-gray-800">{heading}</h2>
      <div
        className="flex items-center gap-4 md:gap-6 overflow-x-scroll scrollbar-none transition-all"
        ref={scrollElement}
      >
        {data.length >= 4 && (
          <>
            <button
              className="bg-white shadow-md rounded-full p-2 absolute left-0 text-lg hidden md:block z-10"
              onClick={scrollLeft}
            >
              <FaAngleLeft />
            </button>
            <button
              className="bg-white shadow-md rounded-full p-2 absolute right-0 text-lg hidden md:block z-10"
              onClick={scrollRight}
            >
              <FaAngleRight />
            </button>
          </>
        )}
        {loading
          ? loadingList.map((_, index) => (
              <div
                key={index}
                className="w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="bg-slate-200 h-48 p-4 flex justify-center items-center animate-pulse"></div>
                <div className="p-4 grid gap-3">
                  <h2 className="font-medium text-base md:text-lg text-ellipsis line-clamp-1 p-1 py-2 animate-pulse rounded-full bg-slate-200"></h2>
                  <p className="capitalize  p-1 animate-pulse rounded-full bg-slate-200 py-2"></p>
                  <div className="flex gap-3">
                    <p className=" font-medium p-1 animate-pulse rounded-full bg-slate-200 w-full py-2"></p>
                    <p className="line-through p-1 animate-pulse rounded-full bg-slate-200 w-full py-2"></p>
                  </div>
                  <button className="text-sm  px-3 rounded-full bg-slate-200 py-2 animate-pulse"></button>
                </div>
              </div>
            ))
          : data.map((product, index) => (
              <Link
                key={index}
                to={`/productDetails/${product?._id}`}
                className="w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] bg-white rounded-lg shadow-lg overflow-hidden transition-transform "
              >
                <div className="bg-zinc-200 h-48 p-4 flex justify-center items-center">
                  <img
                    src={product.productImages[0]}
                    className="object-contain mix-blend-multiply h-full w-full transition-transform transform hover:scale-110"
                  />
                </div>
                <div className="py-4 px-4 grid gap-2">
                  <h2 className="font-medium text-base md:text-xl text-ellipsis line-clamp-1 text-black">
                    {product?.title}
                  </h2>
                  <p className="capitalize text-slate-500">
                    {product?.category}
                  </p>
                  <div className="flex gap-2">
                    <p className="text-lg font-medium">{product?.price}</p>
                    <p className="text-zinc-500 text-lg line-through">
                      {product?.fakePrice}
                    </p>
                  </div>
                  <button
                    className="font-semibold text-md bg-zinc-600 hover:bg-zinc-900 text-white px-3 py-[0.4rem] rounded-lg transition-all"
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddToCart(e, product);
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
};

export default VerticalCardProduct;
