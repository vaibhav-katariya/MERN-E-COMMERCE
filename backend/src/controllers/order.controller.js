import { Order } from "../model/order.model.js";
import { Product } from "../model/product.model.js";
import { User } from "../model/user.model.js";

const createOrder = async (req, res) => {
  try {
    const {
      shippingInfo,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      orderItems,
    } = req.body;

    const order = await Order.create({
      shippingInfo,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      orderItems,
      paidAt: Date.now(),
      user: req.user._id,
    });
    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getSingleOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!orderId) {
      return res.status(400).json({ success: false, error: "No order ID" });
    }
    const order = await Order.findById(orderId).populate("user", "name email");
    if (!order)
      return res
        .status(404)
        .json({ success: false, error: "Order not found." });
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getMyOrder = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getAllOrder = async (req, res) => {
  try {
    const user = await User.findById(req.user?._id);
    if (user.role !== "admin") {
      return res.status(400).json({
        success: false,
        error: "You have not access to see all orders",
      });
    }
    const orders = await Order.find();
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    if (!orderId) {
      return res.status(400).json({ success: false, error: "No order ID" });
    }
    const user = await User.findById(req.user?._id);

    if (user.role !== "admin") {
      return res.status(400).json({
        success: false,
        error: "You have not access to see all orders",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, error: "Order not found." });
    }

    if (order.orderStatus === "Delivered") {
      return res.status(400).json({
        success: false,
        error: "You cannot change the status of a delivered order",
      });
    }

    if (status === "Shipped") {
      order.orderItems.forEach(async (order) => {
        await updateStock(order.product, order.quantity);
      });
    }
    order.orderStatus = status;

    if (req.body.status === "Delivered") {
      order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false });
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.stock -= quantity;

  await product.save({ validateBeforeSave: false });
}

const deleteOrder = async (req, res) => {
  try {
    const user = await User.findById(req.user?._id);

    if (user.role !== "admin") {
      return res.status(401).json({
        success: false,
        error: "You are not authorized to perform this action",
      });
    }

    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(500).json({
        success: false,
        error: "Order not deleted",
      });
    }

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export {
  createOrder,
  getSingleOrder,
  getMyOrder,
  getAllOrder,
  updateOrder,
  deleteOrder,
};
