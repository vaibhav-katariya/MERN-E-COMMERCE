import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";

const ProccessOrder = () => {
  const { id } = useParams();

  const [data, setData] = useState();
  const [status, setStatus] = useState("");

  useEffect(() => {
    const orderDetails = async () => {
      const { data } = await axios.get(`https://mern-e-commerce-ulnh.onrender.com/api/v1/order/get-oreder/${id}`);
      setData(data.order);
      setStatus(data?.order?.orderStatus);
    };
    orderDetails();
  }, []);

  const updateOrder = async (e) => {
    e.preventDefault();
    if (status !== "" || status !== null) {
      const res = await axios.put(`https://mern-e-commerce-ulnh.onrender.com/api/v1/order/update-order/${id}`, {
        status: status,
      });

      if (res.data) {
        orderDetails();
      }
    }
  };

  return (
    <div className="my-5 mx-2">
      <section className="py-16 relative">
        <div className="w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto">
          <div className="flex items-start flex-col gap-6 xl:flex-row ">
            <div className="w-full max-w-sm md:max-w-3xl xl:max-w-sm flex items-start flex-col gap-8 max-xl:mx-auto">
              <div className="p-6 border border-gray-200 rounded-3xl w-full group transition-all duration-500 hover:border-gray-400 ">
                <div className="flex items-center justify-between gap-4 ">
                  <p className="font-normal text-lg leading-8 text-gray-400 transition-all duration-500 group-hover:text-gray-700 ">
                    Order Status
                  </p>
                  <p className="font-medium text-lg leading-8 text-gray-600">
                    <div
                      className={`${
                        data?.orderStatus === "Delivered" ? "hidden" : "block"
                      }`}
                    >
                      <form
                        onSubmit={updateOrder}
                        className={
                          data?.orderStatus && data?.orderStatus === "Delivered"
                            ? "text-green-700"
                            : "text-red-700"
                        }
                      >
                        <select
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                        >
                          <option className="text-black">Select Status</option>
                          {data?.orderStatus === "Processing" && (
                            <option className="text-black" value="Shipped">
                              Shipped
                            </option>
                          )}

                          {data?.orderStatus === "Shipped" && (
                            <option className="text-black" value="Delivered">
                              Delivered
                            </option>
                          )}
                        </select>
                        <button
                          className={`py-0.3 px-2 bg-zinc-500 text-white rounded-lg ms-5 text-[1rem] group-hover:bg-zinc-600 transition-all`}
                          type="submit"
                        >
                          Process
                        </button>
                      </form>
                    </div>
                    <p
                      className={`${
                        data?.orderStatus === "Delivered" ? "block" : "hidden"
                      }`}
                    >
                      {data?.orderStatus}
                    </p>
                  </p>
                </div>
              </div>
              <div className="p-6 border border-gray-200 rounded-3xl w-full group transition-all duration-500 hover:border-gray-400 ">
                <h2 className="font-manrope font-bold text-3xl leading-10 text-black pb-6">
                  Order Summary
                </h2>
                <div className="data">
                  <div className="font-normal text-lg leading-8">
                    <p
                      className={
                        data?.paymentInfo &&
                        data?.paymentInfo.status === "succeeded"
                          ? "text-green-700"
                          : "text-red-700"
                      }
                    >
                      {data?.paymentInfo &&
                      data?.paymentInfo.status === "succeeded"
                        ? "PAID"
                        : "NOT PAID"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <p className="font-normal text-lg leading-8 text-gray-400 transition-all duration-500 group-hover:text-gray-700">
                      total
                    </p>
                    <p className="font-medium text-lg leading-8 text-gray-600">
                      {data?.itemsPrice && data?.itemsPrice}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <p className="font-normal text-lg leading-8 text-gray-400 transition-all duration-500 group-hover:text-gray-700">
                      tax
                    </p>
                    <p className="font-medium text-lg leading-8 text-gray-600">
                      {data?.taxPrice && data?.taxPrice}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <p className="font-normal text-lg leading-8 text-gray-400 transition-all duration-500 group-hover:text-gray-700">
                      Amount
                    </p>
                    <p className="font-medium text-lg leading-8 text-gray-600">
                      {data?.totalPrice && data?.totalPrice}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full max-w-sm md:max-w-3xl max-xl:mx-auto">
              <div className="mb-5">
                <h2 className="font-bold mt-2 mb-4 text-2xl">Shipping Info</h2>
                <div className="confirmshippingAreaBox">
                  <div className="flex my-2 gap-2">
                    <p>Name:</p>
                    <span>{data?.user?.username}</span>
                  </div>
                  <div className="flex my-2 gap-2">
                    <p>Phone:</p>
                    <span>{data?.shippingInfo?.phoneNo}</span>
                  </div>
                  <div className="flex my-2 gap-2">
                    <p>Address:</p>
                    <span>{`${data?.shippingInfo?.address}, ${data?.shippingInfo?.city}, ${data?.shippingInfo?.state}, ${data?.shippingInfo?.pinCode}, ${data?.shippingInfo?.country}`}</span>
                  </div>
                </div>
              </div>
              <div className="">
                {data?.orderItems?.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-3 w-full border-[2px] my-2 p-2 rounded-2xl gap-8"
                  >
                    <div>
                      <img
                        className="h-[5rem] w-[5rem] object-contain"
                        src={item.product.productImages[0]}
                        alt="img"
                      />
                    </div>
                    <div className="">
                      <h2 className="font-medium text-xl leading-8 text-black mb-1">
                        {item.product.title}
                      </h2>
                      <p className="font-normal text-lg leading-8 text-gray-500 ">
                        {item.product.category}
                      </p>
                    </div>
                    <div>
                      <p className="font-normal text-xl leading-8 text-black ">
                        {item.quantity} x {item.price} ={" "}
                        {item.quantity * item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default ProccessOrder;
