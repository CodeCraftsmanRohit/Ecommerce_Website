import express from "express";
import userAuth from "../middleware/userAuth.js";
import {purchaseProduct} from "../controllers/paymentController.js"
const router = express.Router();
router.post("/create-checkout-session",purchaseProduct)
export default router;