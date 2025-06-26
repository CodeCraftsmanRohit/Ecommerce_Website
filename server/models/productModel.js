import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  barcode: { type: String, unique: true },
  name: String,
  ecoScore: String,
  materials: [String],
  recyclable: Boolean,
  carbonFootprint: Number,
  recyclingTips: String,
  coverImage:{
    type:String,
    default:''
  },
  category:{
    type:String,
    default:'others'
  },
  price:{
    type:Number
  }
});

export default mongoose.model("Product", productSchema);
