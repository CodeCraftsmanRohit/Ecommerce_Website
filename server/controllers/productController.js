import Product from "../models/productModel.js";
import fs from "fs";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import userModel from "../models/usermodel.js";


export const getProductByBarcode = async (req, res) => {
  try {
    const product = await Product.findOne({ barcode: req.params.barcode });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const loadInitialProducts = async () => {
  try {
    const rawData = fs.readFileSync("../server/Allproducts.json", "utf-8");
    const products = JSON.parse(rawData);

    for (const product of products) {
      const exists = await Product.findOne({ barcode: product.barcode });
      if (!exists) {
        await Product.create(product);
      }
    }

    console.log("✅ Sample products added (if not already present)");
  } catch (err) {
    console.error("❌ Error loading sample products:", err.message);
  }
};



export const addProduct = async (req, res) => {
  try {
    const {
      barcode,
      name,
      ecoScore,
      materials,
      recyclable,
      carbonFootprint,
      recyclingTips,
      category,
      price,
      currentStock,
      salesHistory,
      seasonalTrend,
      weather,
      demandSpike,
      unitCost,
      supplierId,
      leadTime,
      availability,
    } = req.body;

    let coverImageUrl = "";
    if (req.file) {
      const cloudinaryRes = await uploadOnCloudinary(req.file.buffer);
      coverImageUrl = cloudinaryRes.secure_url;
    }

    const newProduct = new Product({
      barcode,
      name,
      ecoScore,
      materials: JSON.parse(materials),
      recyclable: JSON.parse(recyclable),
      carbonFootprint: parseFloat(carbonFootprint),
      recyclingTips,
      coverImage: coverImageUrl,
      category,
      price: parseFloat(price),
      currentStock: parseInt(currentStock),
      salesHistory: JSON.parse(salesHistory),
      seasonalTrend,
      externalFactors: { weather, demandSpike },
      unitCost: parseFloat(unitCost),
      suppliers: [
        {
          id: supplierId,
          leadTime: parseInt(leadTime),
          availability: JSON.parse(availability),
        },
      ],
    });

    await newProduct.save();
    res.status(201).json({ success: true, message: "Product added successfully", product: newProduct });
  } catch (err) {
    console.error("❌ Product creation failed:", err);
    res.status(500).json({ success: false, message: "Failed to add product", error: err.message });
  }
};

export const trackProductScan = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.body;

const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.ecoStats.totalCO2Saved += product.carbonFootprint;
    user.ecoStats.totalItemsScanned += 1;

    const total = user.ecoStats.totalCO2Saved;
    user.ecoStats.ecoRank = total > 10 ? "Gold" : total > 5 ? "Silver" : "Bronze";

    await user.save();

    res.json({
      success: true,
      message: "Eco stats updated successfully",
      stats: user.ecoStats,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};