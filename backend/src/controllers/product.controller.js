import { Product } from "../model/product.model.js";
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

export { uploadProduct };
