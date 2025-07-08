import express from "express";
import { upload } from "../middleware/multer.js"
import userAuth from "../middleware/userAuth.js";
import { getProductByBarcode,addProduct,trackProductScan,getAllProducts } from "../controllers/productController.js";

const router = express.Router();
router.get("/view", getAllProducts);
router.get("/:barcode", getProductByBarcode);
router.post("/add", upload.single("coverImage"), addProduct);
router.post("/track-scan", userAuth, trackProductScan);

export default router;
