import { Router } from "express";
import { upload } from "../middleware/multer.middlerware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  createProductReview,
  deleteProduct,
  deleteProductReview,
  getAllProduct,
  getOwnerProducts,
  getProduct,
  getProductById,
  getProductCategoryProduct,
  getProductReview,
  getProductsByCategory,
  updateProduct,
  uploadProduct,
} from "../controllers/product.controller.js";

const router = Router();

router.route("/getOwnerProduct/:username").get(getOwnerProducts);
router.route("/getProductsByCategory/:category").get(getProductsByCategory);
router.route("/getProductById/:id").get(getProductById);
router.route("/getAllProduct").get(verifyJWT ,getAllProduct);
router.route("/getCategoryProduct").get(getProductCategoryProduct);
router.route("/deleteProduct/:id").delete(verifyJWT, deleteProduct);
router.route("/getProduct").get(getProduct);
router.route("/getProductReviews/:productId").get(getProductReview);
router.route("/createReviews/:productId").post(verifyJWT, createProductReview);
router
  .route("/deleteProductReview/:productId/:reviewId")
  .delete(verifyJWT, deleteProductReview);

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
