import { Router } from "express";
import { upload } from "../middleware/multer.middlerware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  deleteProduct,
  getAllProduct,
  getOwnerProducts,
  getProduct,
  getProductById,
  getProductCategoryProduct,
  getProductsByCategory,
  updateProduct,
  uploadProduct,
} from "../controllers/product.controller.js";

const router = Router();

router.route("/getOwnerProduct/:username").get(getOwnerProducts);
router.route("/getProductsByCategory/:category").get(getProductsByCategory);
router.route("/getProductById/:id").get(getProductById);
router.route("/getAllProduct").get(getAllProduct);
router.route("/getCategoryProduct").get(getProductCategoryProduct);
router.route("/deleteProduct/:id").delete(verifyJWT, deleteProduct);
router.route("/getProduct").get(getProduct)

router
  .route("/upload")
  .post(
    verifyJWT,
    upload.fields([{ name: "productImages", maxCount: 4 }]),
    uploadProduct
  );

router
  .route("/updateProduct/:id")
  .put(
    verifyJWT,
    upload.fields([{ name: "productImages", maxCount: 4 }]),
    updateProduct
  );

export default router;
