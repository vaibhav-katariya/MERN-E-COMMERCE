import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "seller"],
      default: "user",
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  if (!password) return false;
  return await bcryptjs.compare(password, this.password);
};

userSchema.methods.genToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.TOKEN_SECRET,
    {
      expiresIn: process.env.TOKEN_EXPIRY,
    }
  );
};


export const User = mongoose.model("User", userSchema);
