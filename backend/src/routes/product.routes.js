import { Router } from "express";
import { upload } from "../middleware/multer.middlerware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  deleteProduct,
  getAllProduct,
  getOwnerProducts,
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

router.route("/deleteProduct/:id").delete(verifyJWT, deleteProduct);
export default router;
