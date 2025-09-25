import mongoose from "mongoose";

const  categorySchema = new mongoose.Schema({
  name:{
    type: String,
    trim: true,
    required: true,
    unique: true,
    maxLength: 32,
  },
})

export default mongoose.model("Category", categorySchema);