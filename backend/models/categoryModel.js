import mongoose from "mongoose";

const  categorySchema = new mongoose.Schema({
  name:{
    type: String,
    trim: true,
    required: true,
    unique: true,
    maxLength: 32,
  },
  image: {
    type: String,
  },
  taxPercentage: {
    type: Number,
    default: 10,
  },
})

export default mongoose.model("Category", categorySchema);