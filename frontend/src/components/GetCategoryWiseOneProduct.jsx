import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const GetCategoryWiseOneProduct = () => {
  const [categoryProduct, setCategoryProduct] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryLoading = new Array(13).fill(null);

  const fetchCategoryProduct = async () => {
    const product = await axios.get("https://mern-e-commerce-ulnh.onrender.com/api/v1/product/getCategoryProduct");
    setCategoryProduct(product.data.categoryProduct);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategoryProduct();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center gap-5 justify-start overflow-scroll scrollbar-none">
        {loading
          ? categoryLoading.map((el, index) => {
              return (
                <div
                  className="h-16 w-16 flex-shrink-0 rounded-full overflow-hidden bg-slate-200 animate-pulse"
                  key={"categoryLoading" + index}
                ></div>
              );
            })
          : categoryProduct.map((product) => {
              return (
                <div className="cursor-pointer" key={product?.category}>
                  <div className="w-16 h-16  rounded-full overflow-hidden p-4 bg-slate-200 flex items-center justify-center">
                    <img
                      src={product?.productImages[0]}
                      alt={product?.category}
                      className="h-full object-scale-down mix-blend-multiply hover:scale-125 transition-all"
                    />
                  </div>
                  <p className="text-center text-sm md:text-base capitalize">
                    {product?.category}
                  </p>
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default GetCategoryWiseOneProduct;
