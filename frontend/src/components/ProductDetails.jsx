import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaStar, FaStarHalf } from "react-icons/fa";
import {
  Box,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import { useSelector } from "react-redux";

const ProductDetails = () => {
  const { id } = useParams();
  const user = useSelector((state) => state.user.user);
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
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
  });

  const navigate = useNavigate();

  const findProduct = async () => {
    try {
      const response = await axios.get(`/api/v1/product/getProductById/${id}`);
      const product = response.data.product;
      setData(product);
      setActiveImage(product.productImages[0]);
      setLoading(false);
      setFormData({
        title: product.title,
        description: product.description,
        price: product.price,
        category: product.category,
      });

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
    window.scrollTo(0, 0);
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

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    try {
      console.log(product);
    } catch (error) {
      console.log(error.message);
    }
  };

  const HandleDelete = async (e, productId) => {
    try {
      const response = await axios.delete(
        `/api/v1/product/deleteProduct/${productId}`
      );
      console.log(response.data.message);
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setOpenUpdateModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `/api/v1/product/updateProduct/${data?._id}`,
        formData
      );
      console.log(response.data.message);
      setOpenUpdateModal(false);
      findProduct();
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="">
      <div className="container p-4 px-3 md:flex justify-start md:px-8 my-5">
        <div className="min-h-[200px] flex flex-col md:flex-row gap-8">
          {/***product Image */}
          <div className="min-h-96 flex flex-col lg:flex-row-reverse mx-auto gap-4">
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
                  {data?.productImages?.map((imgURL) => (
                    <div
                      className="h-14 md:h-20 w-14 md:w-20 bg-slate-200 rounded p-1"
                      key={imgURL}
                    >
                      <img
                        src={imgURL}
                        className="w-full h-full mx-auto object-scale-down mix-blend-multiply cursor-pointer"
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
              <p className="bg-slate-200 animate-pulse h-6 lg:h-8 w-full rounded-full inline-block"></p>
              <h2 className="text-2xl lg:text-4xl font-medium h-6 lg:h-8 bg-slate-200 animate-pulse w-full"></h2>
              <p className="capitalize  bg-slate-200 min-w-[100px] animate-pulse h-6 lg:h-8 w-full"></p>

              <div className=" bg-slate-200 h-6 lg:h-8 animate-pulse flex items-center gap-1 w-full"></div>

              <div className="flex items-center gap-2 text-2xl lg:text-3xl font-medium my-1 h-6 lg:h-8 animate-pulse w-full">
                <p className=" bg-slate-200 w-full"></p>
                <p className=" line-through bg-slate-200 w-full"></p>
              </div>

              <div className="flex items-center gap-3 my-2 w-full">
                <button className="h-6 lg:h-8 bg-slate-200 rounded animate-pulse w-full"></button>
                <button className="h-6 lg:h-8 bg-slate-200 rounded animate-pulse w-full"></button>
              </div>

              <div className="w-full">
                <p className="text-slate-600 font-medium my-1 h-6 lg:h-8 bg-slate-200 rounded animate-pulse w-full"></p>
                <p className="bg-slate-200 rounded animate-pulse h-10 lg:h-12 w-full"></p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-center gap-1">
              <p className="bg-zinc-600 text-white px-3 py-[0.5rem] mb-1 font-semibold rounded-lg inline-block w-fit">
                {data?.title}
              </p>
              <h2 className="text-2xl lg:text-4xl font-medium">
                {data?.description}
              </h2>
              <p className="capitalize text-zinc-500">{data?.category}</p>
              <p className="capitalize text-zinc-500">
                {data?.owner?.username}
              </p>
              <div className="flex items-center gap-2 text-2xl lg:text-3xl font-medium my-1">
                <p>{data?.price}</p>
                <p className="text-zinc-400 line-through text-xl">
                  {data?.fakePrice}
                </p>
              </div>
              <div>
                <p className="text-slate-600 font-medium my-1">
                  Description :{" "}
                </p>
                <p>{data?.description}</p>
              </div>
              {user?._id === data.owner?._id ? (
                <div className="flex items-center gap-3 my-2">
                  <button
                    className="border-2 border-zinc-600  rounded px-3 py-1 min-w-[120px] text-zinc-900 font-medium "
                    onClick={(e) => HandleDelete(e, data?._id)}
                  >
                    Delete
                  </button>
                  <button
                    className="rounded px-3 py-1 min-w-[120px] font-medium text-white bg-zinc-600  hover:bg-zinc-900"
                    onClick={handleUpdate}
                  >
                    Update
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 my-2">
                  <button
                    className="border-2 border-zinc-600 rounded px-3 py-1 min-w-[120px] text-zinc-900 font-medium "
                    onClick={(e) => handleBuyProduct(e, data?._id)}
                  >
                    Buy
                  </button>
                  <button
                    className="rounded px-3 py-1 min-w-[120px] font-medium text-white bg-zinc-600  hover:bg-zinc-900"
                    onClick={(e) => handleAddToCart(e, data)}
                  >
                    Add To Cart
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="w-full flex flex-wrap px-3 md:px-8 cursor-pointer my-8">
        <h1 className="my-8 text-2xl font-semibold w-full text-center md:text-start">
          Recommended Product
        </h1>
        <Grid container spacing={2}>
          {(loading ? Array.from(new Array(8)) : categoryData).map(
            (item, index) => (
              <Grid item xs={6} sm={4} md={3} key={index}>
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
            )
          )}
        </Grid>
      </div>

      {/* Update Product Modal */}
      <Dialog
        open={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Update Product</DialogTitle>
        <DialogContent>
          <form onSubmit={handleFormSubmit}>
            <TextField
              margin="normal"
              label="Title"
              name="title"
              fullWidth
              value={formData.title}
              onChange={handleFormChange}
            />
            <TextField
              margin="normal"
              label="Description"
              name="description"
              fullWidth
              value={formData.description}
              onChange={handleFormChange}
            />
            <TextField
              margin="normal"
              label="Price"
              name="price"
              type="number"
              fullWidth
              value={formData.price}
              onChange={handleFormChange}
            />
            <TextField
              margin="normal"
              label="Category"
              name="category"
              fullWidth
              value={formData.category}
              onChange={handleFormChange}
            />
            <DialogActions>
              <Button onClick={() => setOpenUpdateModal(false)} color="primary">
                Cancel
              </Button>
              <Button type="submit" color="primary" variant="contained">
                Update
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductDetails;
