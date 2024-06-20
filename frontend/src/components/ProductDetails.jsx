import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ProductDetails = () => {
  const { id } = useParams();

  const findProduct = async () => {
    const data = await axios.get(`/api/v1/product/getProductById/${id}`);
    console.log(data.data.product);
  };

  useEffect(()=>{
    findProduct();
  },[])

  return <div></div>;
};

export default ProductDetails;
