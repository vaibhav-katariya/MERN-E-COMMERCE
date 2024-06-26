import { Router } from "express";
import { upload } from "../middleware/multer.middlerware.js";
import {
  changePassword,
  getAllUser,
  getCorrentUser,
  loginUser,
  logoutUser,
  registerUser,
  updateUserDetails,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router
  .route("/register")
  .post(upload.fields([{ name: "avatar", maxCount: 1 }]), registerUser);

router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/update-password").put(verifyJWT, changePassword);
router.route("/get-current-user").get(verifyJWT, getCorrentUser);
router.route("/update-user-details").put(
  verifyJWT,
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  updateUserDetails
);
router.route("/alluser").get(verifyJWT , getAllUser)

export default router;
