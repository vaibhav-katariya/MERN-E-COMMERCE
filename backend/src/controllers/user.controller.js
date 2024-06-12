import { Error } from "mongoose";
import { User } from "../model/user.model.js";
import jwt from "jsonwebtoken";
import {
  fileDeleteOnCloudinary,
  fileUploadOnCloudinary,
} from "../utils/fileUploader.js";

const genAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const refreshToken = user.genRefreshToken();
    const accessToken = user.genAccessToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error(
      "Something went wrong while generating access token and refresh token"
    );
  }
};

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const avatarPath = req.files?.avatar?.[0]?.path;

    if (!avatarPath) {
      return res.status(400).json({
        message: "Avatar field is required",
      });
    }

    const avatar = await fileUploadOnCloudinary(avatarPath);

    if (!avatar || !avatar.url) {
      return res.status(500).json({
        message: "Avatar cannot be fetched",
      });
    }

    const user = await User.create({
      username,
      email,
      password,
      avatar: avatar.url,
    });

    const createdUser = await User.findById(user._id).select("-password");

    if (!createdUser) {
      return res.status(500).json({
        message: "User cannot be created",
      });
    }

    res.status(200).json({
      message: "User created successfully",
      createdUser,
    });
  } catch (error) {
    console.error("Error while registering the user:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const {email, password} = req.body
  } catch (error) {
    console.error("Error while login the user:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export { registerUser , loginUser };