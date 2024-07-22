import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { Button } from "@mui/material";

const AllOrders = () => {
  const user = useSelector((state) => state.user.user);
  const [allOrders, setAllOrders] = useState([]);

  const deleteOrderHandler = async (id) => {
    try {
      const res = await axios.delete(`/api/v1/order/delete-order/${id}`);
      setAllOrders(allOrders.filter((order) => order._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 300, flex: 1 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 0.5,
      cellClassName: (params) => {
        return params.row.status === "Delivered"
          ? "text-green-800"
          : "text-red-800";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 150,
      flex: 0.3,
    },

    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      minWidth: 270,
      flex: 0.5,
    },

    {
      field: "actions",
      flex: 0.3,
      headerName: "Actions",
      minWidth: 150,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Fragment>
            <Link to={`/order/${params.row.id}`}>
              <EditIcon />
            </Link>
            <Button onClick={() => deleteOrderHandler(params.row.id)}>
              <DeleteIcon className="text-zinc-600" />
            </Button>
          </Fragment>
        );
      },
    },
  ];
  const rows = [];

  useEffect(() => {
    const getAllOrder = async () => {
      const { data } = await axios.get("/api/v1/order/get-all-orders");
      setAllOrders(data.orders);
    };

    getAllOrder();
  }, []);

  allOrders &&
    allOrders.forEach((item) => {
      rows.push({
        id: item._id,
        itemsQty: item.orderItems.length,
        amount: item.totalPrice,
        status: item.orderStatus,
      });
    });

  return (
    <Fragment>
      <div className="my-5 mx-5 flex flex-wrap gap-5 items-center">
        <h2 className="text-2xl">All Orders : ({allOrders.length})</h2>
        <p>
          Shipped : (
          {allOrders.filter((i) => i.orderStatus === "Shipped").length})
        </p>
        <p>
          Delivered : (
          {allOrders.filter((i) => i.orderStatus === "Delivered").length})
        </p>
        <p>
          Processing : (
          {allOrders.filter((i) => i.orderStatus === "Processing").length})
        </p>
      </div>
      <div className="px-5">
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
        />
      </div>
    </Fragment>
  );
};

export default AllOrders;
