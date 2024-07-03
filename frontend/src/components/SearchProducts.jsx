import React from "react";
import { useParams } from "react-router";
import VerticalCardProduct from "./VerticalCardProduct";

const SearchProducts = () => {
  const { keyword } = useParams();

  return <VerticalCardProduct keyword={keyword} />;
};

export default SearchProducts;
