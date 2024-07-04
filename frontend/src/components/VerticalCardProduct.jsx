import React, { useEffect, useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import { Box } from "@mui/material";

const VerticalCardProduct = ({ keyword, heading }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadingList = new Array(13).fill(null);
  const [price, setPrice] = useState([0, 25000]);
  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    try {
      console.log(product);
    } catch (error) {
      console.error(error.message);
    }
  };

  const priceHandler = (event, newPrice) => {
    setPrice(newPrice);
  };

  const fetchData = async () => {
    const getProduct = await axios.get(
      `/api/v1/product/getProduct?keyword=${keyword}&price[gte]=${price[0]}&price[lte]=${price[1]}`
    );
    setLoading(false);
    console.log(getProduct.data);
    setData(getProduct?.data.products);
  };

  useEffect(() => {
    fetchData();
  }, [keyword, price]);

  return (
    <div className="container w-full flex md:flex-row flex-col my-6 mx-4 relative">
      <div className="md:w-[25%] mx-5">
        <Typography>Price</Typography>
        <Box sx={{ width: 250}}>
          <Slider
            value={price}
            onChange={priceHandler}
            valueLabelDisplay="auto"
            aria-labelledby="range-slider"
            min={0}
            max={25000}
          />
        </Box>

        {/* <Typography>Categories</Typography>
                  <ul className="categoryBox">
                    {categories.map((category) => (
                      <li
                        className="category-link"
                        key={category}
                        onClick={() => setCategory(category)}
                      >
                        {category}
                      </li>
                    ))}
                  </ul> */}

        {/* <fieldset>
                    <Typography component="legend">Ratings Above</Typography>
                    <Slider
                      value={ratings}
                      onChange={(e, newRating) => {
                        setRatings(newRating);
                      }}
                      aria-labelledby="continuous-slider"
                      valueLabelDisplay="auto"
                      min={0}
                      max={5}
                    />
                  </fieldset> */}
      </div>
      <div className="md:w-[75%] flex gap-2">
        {data.length > 0
          ? loading
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
                <div className="flex justify-center">
                  <Link
                    key={index}
                    to={`/productDetails/${product?._id}`}
                    className="w-full min-w-[150px] md:min-w-[320px] max-w-[170px] md:max-w-[320px] bg-white rounded-lg shadow-lg overflow-hidden transition-transform "
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
                </div>
              ))
          : "product not found"}
      </div>
    </div>
  );
};

export default VerticalCardProduct;
