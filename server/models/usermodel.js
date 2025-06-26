import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
 coverImage: {
    type: String,
    default: ' '
  },
  resetOtp: { type: String, default: '' },
  resetOtpExpireAt: { type: Number, default: 0 },
  cartData:{
    type:Object,
    default:{}
  },
  ecoStats: {
  totalCO2Saved: { type: Number, default: 0 },
  totalItemsScanned: { type: Number, default: 0 },
  ecoRank: { type: String, default: "Bronze" }
},
ecoCart: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],

},{timestamps:true,minimize:false});


const userModel =mongoose.models.user || mongoose.model('user',userSchema)

export default userModel;