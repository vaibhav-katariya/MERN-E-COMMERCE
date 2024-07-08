import React from "react";
import CartItem from "../components/CartItem";
import { useSelector } from "react-redux";
const Cart = () => {
  const product = useSelector((state) => state.cart.carts);

  return (
    <>
      {product?.map((item, index) => (
        <CartItem item={item} key={index} />
      ))}
    </>
  );
};

export default Cart;
