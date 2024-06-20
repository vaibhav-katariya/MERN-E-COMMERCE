import { Router } from "express";
import { upload } from "../middleware/multer.middlerware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  deleteProduct,
  getAllProduct,
  getOwnerProducts,
  getProductById,
  updateProduct,
  uploadProduct,
} from "../controllers/product.controller.js";

const router = Router();

router
  .route("/upload")
  .post(
    verifyJWT,
    upload.fields([{ name: "productImages", maxCount: 4 }]),
    uploadProduct
  );
router.route("/getOwnerProduct/:username").get(getOwnerProducts);
router.route("/getProductById/:id").get(getProductById);
router.route("/getAllProduct").get(getAllProduct);
router
  .route("/updateProduct/:id")
  .put(
    verifyJWT,
    upload.fields([{ name: "productImage", maxCount: 1 }]),
    updateProduct
  );

router.route("/deleteProduct/:id").delete(verifyJWT, deleteProduct);
export default router;
