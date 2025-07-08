import express from "express";
import {
  registerAdmin,
  loginAdmin,
  isAdminAuthenticated,
  logoutAdmin,getAllUsersWithOrders,getUserOrdersByAdmin
} from "../controllers/adminController.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/is-auth", isAdminAuthenticated);
router.post("/logout", logoutAdmin);
router.get("/users-with-orders", getAllUsersWithOrders);
router.get("/user-orders/:id", getUserOrdersByAdmin);

export default router;
