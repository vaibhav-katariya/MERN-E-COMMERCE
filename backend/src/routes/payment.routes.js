import { Router } from "express";

import { verifyJWT } from "../middleware/auth.middleware.js";
import { processPayment } from "../controllers/payment.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/process").post(processPayment)

export default router;
