import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaStar, FaStarHalf } from "react-icons/fa";
import { Box, Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import { formatDistanceToNow } from "date-fns";

const ProductDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const productImageListLoading = new Array(4).fill(null);
  const [activeImage, setActiveImage] = useState("");
  const [zoomImageCoordinate, setZoomImageCoordinate] = useState({
    x: 0,
    y: 0,
  });
  const [zoomImage, setZoomImage] = useState(false);
  const [categoryData, setCategoryData] = useState([]);

  const navigate = useNavigate();

  const findProduct = async () => {
    try {
      const response = await axios.get(`/api/v1/product/getProductById/${id}`);
      const product = response.data.product;
      setData(product);
      setActiveImage(product.productImages[0]);
      setLoading(false);

      // Fetch products by category
      if (product.category) {
        findProductByCategory(product.category);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setLoading(false);
    }
  };

  const findProductByCategory = async (category) => {
    try {
      const categoryData = await axios.get(
        `/api/v1/product/getProductsByCategory/${category}`
      );
      setCategoryData(categoryData.data.data);
    } catch (error) {
      console.error("Error fetching category products:", error);
    }
  };

  useEffect(() => {
    findProduct();
  }, [id]);

  const handleMouseEnterProduct = (imageURL) => {
    setActiveImage(imageURL);
  };

  const handleZoomImage = useCallback(
    (e) => {
      setZoomImage(true);
      const { left, top, width, height } = e.target.getBoundingClientRect();
      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;
      setZoomImageCoordinate({ x, y });
    },
    [zoomImageCoordinate]
  );

  const handleLeaveImageZoom = () => {
    setZoomImage(false);
  };

  const handleBuyProduct = (e, productId) => {
    e.preventDefault();
    // Handle buy product logic
  };

  const handleAddToCart = (e, productId) => {
    e.preventDefault();
    // Handle add to cart logic
  };

  return (
    <div className="">
      <div className="container mx-auto p-4 px-2 my-5">
        <div className="min-h-[200px] flex flex-col md:flex-row gap-8">
          {/***product Image */}
          <div className="h-96 flex flex-col lg:flex-row-reverse gap-4">
            <div className="h-[300px] w-[300px] lg:h-96 lg:w-96 bg-slate-200 relative p-2">
              <img
                src={activeImage}
                className="h-full w-full object-scale-down mix-blend-multiply"
                onMouseMove={handleZoomImage}
                onMouseLeave={handleLeaveImageZoom}
              />

              {/**product zoom */}
              {zoomImage && (
                <div className="hidden lg:block absolute min-w-[500px] overflow-hidden min-h-[400px] bg-slate-200 p-1 -right-[510px] top-0">
                  <div
                    className="w-full h-full min-h-[400px] min-w-[500px] mix-blend-multiply scale-150"
                    style={{
                      background: `url(${activeImage})`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: `${zoomImageCoordinate.x * 100}% ${
                        zoomImageCoordinate.y * 100
                      }%`,
                    }}
                  ></div>
                </div>
              )}
            </div>

            <div className="h-full">
              {loading ? (
                <div className="flex gap-2 lg:flex-col overflow-scroll scrollbar-none h-full">
                  {productImageListLoading.map((_, index) => (
                    <div
                      className="h-20 w-20 bg-slate-200 rounded animate-pulse"
                      key={"loadingImage" + index}
                    ></div>
                  ))}
                </div>
              ) : (
                <div className="flex gap-2 lg:flex-col overflow-scroll scrollbar-none h-full">
                  {data?.productImages?.map((imgURL, index) => (
                    <div
                      className="h-20 w-20 bg-slate-200 rounded p-1"
                      key={imgURL}
                    >
                      <img
                        src={imgURL}
                        className="w-full h-full object-scale-down mix-blend-multiply cursor-pointer"
                        onMouseEnter={() => handleMouseEnterProduct(imgURL)}
                        onClick={() => handleMouseEnterProduct(imgURL)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/***product details */}
          {loading ? (
            <div className="grid gap-1 w-full">
              <p className="bg-slate-200 animate-pulse  h-6 lg:h-8 w-full rounded-full inline-block"></p>
              <h2 className="text-2xl lg:text-4xl font-medium h-6 lg:h-8  bg-slate-200 animate-pulse w-full"></h2>
              <p className="capitalize text-slate-400 bg-slate-200 min-w-[100px] animate-pulse h-6 lg:h-8  w-full"></p>

              <div className="text-red-600 bg-slate-200 h-6 lg:h-8  animate-pulse flex items-center gap-1 w-full"></div>

              <div className="flex items-center gap-2 text-2xl lg:text-3xl font-medium my-1 h-6 lg:h-8  animate-pulse w-full">
                <p className="text-red-600 bg-slate-200 w-full"></p>
                <p className="text-slate-400 line-through bg-slate-200 w-full"></p>
              </div>

              <div className="flex items-center gap-3 my-2 w-full">
                <button className="h-6 lg:h-8  bg-slate-200 rounded animate-pulse w-full"></button>
                <button className="h-6 lg:h-8  bg-slate-200 rounded animate-pulse w-full"></button>
              </div>

              <div className="w-full">
                <p className="text-slate-600 font-medium my-1 h-6 lg:h-8   bg-slate-200 rounded animate-pulse w-full"></p>
                <p className=" bg-slate-200 rounded animate-pulse h-10 lg:h-12  w-full"></p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-center gap-1">
              <p className="bg-red-200 text-red-600 px-2 rounded-full inline-block w-fit">
                {data?.title}
              </p>
              <h2 className="text-2xl lg:text-4xl font-medium">
                {data?.description}
              </h2>
              <p className="capitalize text-slate-400">{data?.category}</p>
              <p className="capitalize text-slate-400">
                {data?.owner?.username}
              </p>

              <div className="text-red-600 flex items-center gap-1">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStarHalf />
              </div>

              <div className="flex items-center gap-2 text-2xl lg:text-3xl font-medium my-1">
                <p className="text-red-600">{data?.price}</p>
                <p className="text-slate-400 line-through">{data?.fakePrice}</p>
              </div>

              <div className="flex items-center gap-3 my-2">
                <button
                  className="border-2 border-red-600 rounded px-3 py-1 min-w-[120px] text-red-600 font-medium hover:bg-red-600 hover:text-white"
                  onClick={(e) => handleBuyProduct(e, data?._id)}
                >
                  Buy
                </button>
                <button
                  className="border-2 border-red-600 rounded px-3 py-1 min-w-[120px] font-medium text-white bg-red-600 hover:text-red-600 hover:bg-white"
                  onClick={(e) => handleAddToCart(e, data?._id)}
                >
                  Add To Cart
                </button>
              </div>

              <div>
                <p className="text-slate-600 font-medium my-1">
                  Description :{" "}
                </p>
                <p>{data?.description}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="w-full flex flex-wrap px-5 cursor-pointer my-8">
        <h1 className="my-8 text-2xl font-semibold w-full text-center">Recommended Product</h1>
        <Grid container spacing={2}>
          {(loading ? Array.from(new Array(8)) : categoryData).map((item, index) => (
            <Grid item xs={6} sm={4} md={3} key={index} >
              <Box sx={{ width: "100%", marginRight: 0.5, my: 2 }}>
                {item ? (
                  <Link to={`/productDetails/${item?._id}`}>
                    <img
                      style={{
                        width: "100%",
                        height: 132,
                        objectFit: "contain",
                      }}
                      alt={item.title}
                      src={item.productImages[0]}
                    />
                  </Link>
                ) : (
                  <Skeleton variant="rectangular" width="100%" height={132} />
                )}

                {item ? (
                  <div>
                    <Box sx={{ pr: 2 }}>
                      <Typography
                        className="truncate"
                        gutterBottom
                        variant="body1"
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        className="truncate"
                        gutterBottom
                        variant="body2"
                      >
                        {item.description}
                      </Typography>
                      <Typography
                        display="block"
                        variant="caption"
                        color="text.secondary"
                      >
                        {item.owner?.username}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        •{" "}
                        {formatDistanceToNow(new Date(item.createdAt), {
                          addSuffix: true,
                        })}
                      </Typography>
                    </Box>
                  </div>
                ) : (
                  <Box sx={{ pt: 0.5 }}>
                    <Skeleton />
                    <Skeleton width="60%" />
                  </Box>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
};

export default ProductDetails;
