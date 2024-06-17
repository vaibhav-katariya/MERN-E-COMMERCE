import { Router } from "express";
import { upload } from "../middleware/multer.middlerware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { uploadProduct } from "../controllers/product.controller.js";

const router = Router();

router
  .route("/upload")
  .post(
    verifyJWT,
    upload.fields([{ name: "productImage", maxCount: 1 }]),
    uploadProduct
  );

export default router;
