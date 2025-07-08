import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  barcode: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  ecoScore: { type: String },
  materials: [String],
  recyclable: { type: Boolean, default: false },
  carbonFootprint: { type: Number },
  recyclingTips: { type: String },
  coverImage: { type: String, default: "" },
  category: { type: String, default: "others" },
  price: { type: Number },
  currentStock: { type: Number, default: 0 },
  salesHistory: [Number], // Monthly data, e.g. [30, 45, ...]
  seasonalTrend: { type: String },
  externalFactors: {
    weather: { type: String },
    demandSpike: { type: String },
  },
  unitCost: { type: Number },
  suppliers: [
    {
      id: String,
      leadTime: Number,
      availability: Boolean,
    }
  ]
});

export default mongoose.model("Product", productSchema);
