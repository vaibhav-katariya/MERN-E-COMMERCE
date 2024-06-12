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
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "email and password must be required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "user not found",
      });
    }

    const correctPassword = await user.isPasswordCorrect(password);

    if (!correctPassword) {
      return res.status(400).json({
        message: "email or passwrod invalid",
      });
    }

    const { accessToken, refreshToken } = await genAccessTokenAndRefreshToken(
      user._id
    );

    const loginUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    const option = {
      httpOnly: true,
      secure: true,
    };

    res
      .status(200)
      .cookie("accessToken", accessToken, option)
      .cookie("refreshToken", refreshToken, option)
      .json({
        loginUser,
      });
  } catch (error) {
    console.error("Error while login the user:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: { refreshToken: "" },
      },
      {
        new: true,
      }
    );

    const option = {
      httpOnly: true,
      secure: true,
    };

    res
      .status(200)
      .clearCookie("accessToken", option)
      .clearCookie("refreshToken", option)
      .json({
        message: "User logged out successfully",
      });
  } catch (error) {
    console.error("Error while logout the user:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export { registerUser, loginUser, logoutUser };
