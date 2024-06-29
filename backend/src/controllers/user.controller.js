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
    const { username, email, password, role } = req.body;

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

    const avatarPath = req.files?.avatar[0]?.path;

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
      role,
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

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message: "Please provide both old and new passwords",
      });
    }

    const user = await User.findById(req.user?._id);

    if (user?._id.toString() !== req.user?._id.toString()) {
      return res.status(401).json({
        message: "Unauthorized to change password",
      });
    }

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Old password is incorrect",
      });
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      message: "password updated successfully",
    });
  } catch (error) {
    console.error("Error while update the password:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getCorrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Error while get the user:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getAllUser = async (req, res) => {
  try {
    const currUserId = req.user._id;

    if (!currUserId) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const findUser = await User.findById(currUserId);

    if (!findUser) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    if (findUser?.role !== "admin") {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const user = await User.find().select("-password -refreshToken");

    res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Error while get all the user:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const updateUserDetails = async (req, res) => {
  const { username, email, role } = req.body;

  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      throw new Error("User not found");
    }

    if (
      user?._id.toString() !== req.user?._id.toString() ||
      user?.role !== "admin"
    ) {
      return res.status(401).json({
        message: "Unauthorized to change user details",
      });
    }

    let updatedFields = {};

    if (req.files?.avatar) {
      const avatarPath = req.files.avatar[0].path;

      const avatar_public_id = user.avatar.split("/").pop().split(".")[0];

      await fileDeleteOnCloudinary(avatar_public_id);

      const avatar = await fileUploadOnCloudinary(avatarPath);

      if (!avatar || !avatar.url) {
        return res.status(500).json({
          message: "Failed to upload avatar",
        });
      }
      updatedFields.avatar = avatar.url;
    }

    if (username && username !== user.username) {
      updatedFields.username = username;
    }

    if (email && email !== user.email) {
      updatedFields.email = email;
    }

    if (role && role !== user.role) {
      updatedFields.role = role;
    }

    const updateUser = await User.findByIdAndUpdate(
      req.user?._id,
      { $set: updatedFields },
      { new: true }
    ).select("-password -refreshToken");

    if (!updateUser) {
      return res.status(500).json({
        message: "Failed to update user details",
      });
    }

    const { accessToken, refreshToken } = await genAccessTokenAndRefreshToken(
      user._id
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
        message: "User details updated successfully",
        updateUser,
      });
  } catch (error) {
    console.error("Error while update the user:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const updateRole = async (req, res) => {
  try {
    const { role, id } = req.body;

    const isAdminId = req.user?._id;

    const isAdmin = await User.findById(isAdminId);

    if (isAdmin.role !== "admin") {
      return res.status(401).json({
        message: "You are not authorized to perform this action",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const updateUser = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          role: role,
        },
      },
      { new: true }
    ).select("-password -refreshToken");
    if (!updateUser) {
      return res.status(500).json({
        message: "Failed to update user details",
      });
    }
    res.status(200).json({
      message: "User details updated successfully",
      updateUser,
    });
  } catch (error) {
    console.error("Error while update the user role:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const isAdminId = req.user?._id;
    const isAdmin = await User.findById(isAdminId);
    if (isAdmin.role !== "admin") {
      return res.status(401).json({
        message: "You are not authorized to perform this action",
      });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const avatar_public_id = user.avatar.split("/").pop().split(".")[0];

    await fileDeleteOnCloudinary(avatar_public_id);

    await User.findByIdAndDelete(id);
    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error while deleting the user:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export {
  registerUser,
  loginUser,
  logoutUser,
  changePassword,
  getCorrentUser,
  updateUserDetails,
  getAllUser,
  updateRole,
  deleteUser,
};
