import React, { useEffect, useState } from "react";
import GetCategoryWiseOneProduct from "../components/GetCategoryWiseOneProduct";
import { Pagination, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import { addcart } from "../store/cartSlice";
import { useDispatch } from "react-redux";
import MetaData from "../helpers/MetaData";
import axios from "axios";

const Home = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State to handle errors
  const loadingList = Array.from({ length: 6 });
  const [resultPerPage, setResultPerPage] = useState(6);
  const [productsCount, setProductsCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();

  const totalPages = Math.ceil(productsCount / resultPerPage);

  const getProduct = async () => {
    setLoading(true);
    setError(null); // Reset error state
    try {
      const { data } = await axios.get(
        `/api/v1/product/getProduct?page=${currentPage}`
      );
      setResultPerPage(data.resultPerPage);
      setProductsCount(data.productCount);
      setData(data.products);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    dispatch(addcart(product));
  };

  const handleChange = (event, value) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    getProduct();
  }, [currentPage]);

  return (
    <>
      <MetaData title="Shop-Trand-E-COMMERCE" />
      <GetCategoryWiseOneProduct />
      <div className="container w-full mx-auto my-6 flex justify-center relative">
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex justify-center md:justify-start w-full gap-2 flex-wrap">
          {loading ? (
            loadingList.map((_, index) => (
              <div
                key={index}
                className="w-full min-w-[170px] md:min-w-[300px] max-w-[180px] md:max-w-[310px] bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="bg-slate-200 h-48 p-4 flex justify-center items-center animate-pulse"></div>
                <div className="p-4 grid gap-3">
                  <h2 className="font-medium text-base md:text-lg text-ellipsis line-clamp-1 p-1 py-2 animate-pulse rounded-full bg-slate-200"></h2>
                  <p className="capitalize p-1 animate-pulse rounded-full bg-slate-200 py-2"></p>
                  <div className="flex gap-3">
                    <p className="font-medium p-1 animate-pulse rounded-full bg-slate-200 w-full py-2"></p>
                    <p className="line-through p-1 animate-pulse rounded-full bg-slate-200 w-full py-2"></p>
                  </div>
                  <button className="text-sm px-3 rounded-full bg-slate-200 py-2 animate-pulse"></button>
                </div>
              </div>
            ))
          ) : data.length > 0 ? (
            data.map((product) => (
              <div key={product._id} className="flex justify-between">
                <Link
                  to={`/productDetails/${product._id}`}
                  className="w-[170px] md:w-[290px] bg-white rounded-lg shadow-lg transition-transform overflow-hidden"
                >
                  <div className="bg-zinc-200 h-48 p-4 flex justify-center items-center">
                    <img
                      src={product.productImages[0]}
                      alt={product.title}
                      className="object-contain mix-blend-multiply h-full w-full transition-transform transform hover:scale-110"
                    />
                  </div>
                  <div className="py-4 px-4 grid gap-2">
                    <h2 className="font-medium text-base md:text-xl text-ellipsis line-clamp-1 text-black">
                      {product.title}
                    </h2>
                    <p className="capitalize text-slate-500">
                      {product.category}
                    </p>
                    <div className="flex gap-2">
                      <p className="text-lg font-medium">{product.price}</p>
                      <p className="text-zinc-500 text-lg line-through">
                        {product.fakePrice}
                      </p>
                    </div>
                    {product.stock > 0 ? (
                      <button
                        className="font-semibold text-md bg-zinc-600 hover:bg-zinc-900 text-white px-3 py-[0.4rem] rounded-lg transition-all"
                        onClick={(e) => handleAddToCart(e, product)}
                      >
                        Add to Cart
                      </button>
                    ) : (
                      <h3 className="text-red-900 font-semibold text-xl">
                        Out of Stock
                      </h3>
                    )}
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <p>Product not found</p>
          )}
        </div>
        {totalPages > 1 && (
          <div className="absolute -bottom-10 end-10">
            <Stack spacing={2}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handleChange}
              />
            </Stack>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
