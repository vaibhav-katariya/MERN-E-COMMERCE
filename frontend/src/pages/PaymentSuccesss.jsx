import React from "react";
import { Link } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MetaData from "../helpers/MetaData";
const PaymentSuccesss = () => {
  return (
    <div className="h-[80vh] flex justify-center items-center flex-col w-full">
      <MetaData title="Shop-Trend-Payment-Success" />
      <CheckCircleIcon style={{ fontSize: "3rem", marginBottom: "2rem" }} />

      <h1 className="mb-5 text-2xl md:text-4xl font-semibold text-center">
        Your Order has been Placed successfully{" "}
      </h1>
      <Link
        to={"/profile/myOrders"}
        className="py-2 px-3 bg-zinc-700 text-lg text-white rounded-lg"
      >
        View Orders
      </Link>
    </div>
  );
};

export default PaymentSuccesss;
