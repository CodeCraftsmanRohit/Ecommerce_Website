import express from "express";
import {  getUserOrders,saveUserOrders,updateOrderStatus, getUserOrdersByAdmin } from "../controllers/orderController.js";
import userAuth2 from "../middleware/userAuth2.js";

const router = express.Router();

// Use `userAuth` as your authentication middleware

router.get("/", userAuth2, getUserOrders);
router.post("/save", userAuth2, saveUserOrders);
router.patch("/update-status/:orderId", updateOrderStatus);
router.get("/user/:userId", getUserOrdersByAdmin);

export default router;
