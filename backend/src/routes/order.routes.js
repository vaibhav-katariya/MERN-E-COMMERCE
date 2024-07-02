import { Router } from "express";
import {
  createOrder,
  getSingleOrder,
  getMyOrder,
  getAllOrder,
  updateOrder,
  deleteOrder,
} from "../controllers/order.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/create-oreder").post(createOrder);
router.route("/get-oreder/:orderId").get(getSingleOrder);
router.route("/get-oreder").get(getMyOrder);
router.route("/get-all-orders").get(getAllOrder);
router.route("/update-order/:orderId").put(updateOrder);
router.route("/delete-order/:id").delete(deleteOrder);

export default router;
