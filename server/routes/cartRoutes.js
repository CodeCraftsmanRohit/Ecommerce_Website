// routes/cartRoutes.js
import express from "express";
import { addToCart, removeFromCart, getCart ,clearEcoCart} from "../controllers/cartController.js";
import userAuth2 from '../middleware/userAuth.js'

const router = express.Router();

// Routes
router.post("/add", userAuth2, addToCart);
router.post("/remove", userAuth2, removeFromCart);
router.get("/", userAuth2, getCart);
router.post("/clear", userAuth2, clearEcoCart);
export default router;
