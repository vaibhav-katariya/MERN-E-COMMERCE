import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import { Box, Pagination, Stack } from "@mui/material";
import { addcart } from "../store/cartSlice";

const VerticalCardProduct = ({ keyword, heading }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadingList = new Array(6).fill(null);
  const [price, setPrice] = useState([0, 25000]);
  const [ratings, setRatings] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterProduct, setFilterProduct] = useState(1);
  const [resultPerPage, setResultPerPage] = useState(6);
  const [productsCount, setProductsCount] = useState(1);
  const dispatch = useDispatch();

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    try {
      dispatch(addcart(product));
    } catch (error) {
      console.log(error.message);
    }
  };

  const priceHandler = (event, newPrice) => {
    setPrice(newPrice);
  };

  const handleChange = (event, value) => {
    setCurrentPage(value);
  };

  const fetchData = async () => {
    setLoading(true);
    const getProduct = await axios.get(
      `https://mern-e-commerce-ulnh.onrender.com/api/v1/product/getProduct?keyword=${keyword}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}&page=${currentPage}`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    setLoading(false);
    console.log(getProduct.data);
    setFilterProduct(getProduct.data.filterProductCount);
    setResultPerPage(getProduct.data.resultPerPage);
    setProductsCount(getProduct.data.productCount);
    setData(getProduct?.data.products);
  };

  useEffect(() => {
    fetchData();
  }, [keyword, price, ratings, currentPage]);

  const totalPages = Math.ceil(productsCount / resultPerPage);

  return (
    <div className="container w-full flex md:flex-row flex-col my-6 mx-4 relative">
      {data.length > 0 && (
        <>
          <div className="md:w-[25%] mx-5 sticky">
            <Typography>Price</Typography>
            <Box sx={{ width: 250 }}>
              <Slider
                value={price}
                onChange={priceHandler}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                min={0}
                max={25000}
              />
            </Box>

            <fieldset>
              <Typography component="legend">Ratings Above</Typography>
              <Slider
                sx={{ width: 250 }}
                value={ratings}
                onChange={(e, newRating) => {
                  setRatings(newRating);
                }}
                aria-labelledby="continuous-slider"
                valueLabelDisplay="auto"
                min={0}
                max={5}
              />
            </fieldset>
          </div>
        </>
      )}
      <div className="md:w-[70%] flex gap-2 flex-wrap">
        {data.length > 0
          ? loading
            ? loadingList.map((_, index) => (
                <div
                  key={index}
                  className="w-full  min-w-[150px] md:min-w-[290px] max-w-[170px] md:max-w-[290px] bg-white rounded-lg shadow-lg overflow-hidden"
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
                <div className="flex justify-between">
                  <Link
                    key={index}
                    to={`/productDetails/${product?._id}`}
                    className=" w-[170px] md:w-[290px] bg-white rounded-lg shadow-lg transition-transform  overflow-hidden"
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
                      {product.stock > 0 ? (
                        <button
                          className="font-semibold text-md bg-zinc-600 hover:bg-zinc-900 text-white px-3 py-[0.4rem] rounded-lg transition-all"
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddToCart(e, product);
                          }}
                        >
                          Add to Cart
                        </button>
                      ) : (
                        <h3 className="text-red-900 font-semibold text-xl">
                          out of stock
                        </h3>
                      )}
                    </div>
                  </Link>

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
              ))
          : "product not found"}
      </div>
    </div>
  );
};

export default VerticalCardProduct;
