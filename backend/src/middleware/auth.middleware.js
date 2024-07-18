import jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";

const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("authorization")?.replace("Bearer", "").trim();
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decodedToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(decodedToken.id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return res.status(400).json({ message: "Invalid accessToken" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error while verifying user:", error);
    return res.status(500).json({ message: "Error while verifying user" });
  }
};

export { verifyJWT };
