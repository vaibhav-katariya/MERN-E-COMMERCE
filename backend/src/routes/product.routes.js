import { Router } from "express";
import { upload } from "../middleware/multer.middlerware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  getAllProduct,
  getOwnerProducts,
  getProductById,
  uploadProduct,
} from "../controllers/product.controller.js";

const router = Router();

router
  .route("/upload")
  .post(
    verifyJWT,
    upload.fields([{ name: "productImage", maxCount: 1 }]),
    uploadProduct
  );
router.route("/getOwnerProduct/:username").get(getOwnerProducts);
router.route("/getProductById/:id").get(getProductById);
router.route("/getAllProduct").get(getAllProduct);
export default router;
