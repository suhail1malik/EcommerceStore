import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      trim: true,
      select: false,
    },
    phone: { type: String, trim: true },
    profilePic: { type: String, default: "" },
    isAdmin: { type: Boolean, default: false },
    
    // Password Reset Fields
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
  },

  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
