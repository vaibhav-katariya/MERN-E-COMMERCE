import { Product } from "../model/product.model.js";
import { User } from "../model/user.model.js";
import { fileUploadOnCloudinary } from "../utils/fileUploader.js";

const uploadProduct = async (req, res) => {
  const { title, description, fakePrice, price, category, rating } = req.body;
  try {
    if (!title || !description || !fakePrice || !price || !category) {
      return res.status(400).json({
        message: "Please fill all the fields",
      });
    }

    const productImagePath = req.files?.productImage[0].path;

    if (!productImagePath) {
      return res.status(400).json({
        message: "productImage field is required",
      });
    }

    const productImage = await fileUploadOnCloudinary(productImagePath);

    if (!productImage || !productImage.url) {
      return res.status(500).json({
        message: "productImage cannot be fetched",
      });
    }

    const product = await Product.create({
      title,
      description,
      fakePrice,
      price,
      category,
      rating,
      productImage: productImage.url,
      owner: req.user?._id,
    });

    const createdProduct = await Product.findById(product._id);

    if (!createdProduct) {
      return res.status(500).json({
        message: "product cannot be created",
      });
    }

    res.status(200).json({
      message: "product created successfully",
      createdProduct,
    });
  } catch (error) {
    console.log("error while upload product", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const getOwnerProducts = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const data = await Product.find({ owner: user._id }).populate({
      path: "owner",
      select: "-password -refreshToken",
    });

    if (!data) {
      return res.status(404).json({
        message: "No products found",
      });
    }

    res.status(200).json({
      message: "products fetched successfully",
      data,
    });
  } catch (error) {
    console.log("error while get product", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id).populate({
      path: "owner",
      select: "-password -refreshToken",
    });
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    res.status(200).json({
      message: "Product fetched successfully",
      product,
    });
  } catch (error) {
    console.log("error while get product by id", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const getAllProduct = async (req, res) => {
  try {
    const product = await Product.find({}).populate({
      path: "owner",
      select: "-password -refreshToken",
    });
    if (!product) {
      return res.status(404).json({
        message: "No products found",
      });
    }
    res.status(200).json({
      message: "All products fetched successfully",
      product,
    });
  } catch (error) {
    console.log("error while get all product", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export { uploadProduct, getOwnerProducts, getProductById, getAllProduct };
