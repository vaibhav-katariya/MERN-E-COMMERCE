import { Product } from "../model/product.model.js";
import { User } from "../model/user.model.js";
import {
  fileDeleteOnCloudinary,
  fileUploadOnCloudinary,
} from "../utils/fileUploader.js";

const uploadProduct = async (req, res) => {
  const { title, description, fakePrice, price, category, rating } = req.body;
  try {
    if (!title || !description || !fakePrice || !price || !category) {
      return res.status(400).json({
        message: "Please fill all the fields",
      });
    }

    if (
      !req.files ||
      !req.files.productImages ||
      req.files.productImages.length === 0
    ) {
      return res.status(400).json({
        message: "No images were uploaded",
      });
    }

    const productImages = await Promise.all(
      req.files.productImages.map(async (file) => {
        const productImagePath = file.path;

        const productImage = await fileUploadOnCloudinary(productImagePath);

        if (!productImage || !productImage.url) {
          throw new Error("One or more images could not be uploaded");
        }

        return productImage.url;
      })
    );

    const product = await Product.create({
      title,
      description,
      fakePrice,
      price,
      category,
      rating,
      productImages,
      owner: req.user?._id,
    });

    const createdProduct = await Product.findById(product._id);

    if (!createdProduct) {
      return res.status(500).json({
        message: "Product could not be created",
      });
    }

    res.status(200).json({
      message: "Product created successfully",
      createdProduct,
    });
  } catch (error) {
    console.error("Error while uploading product", error);
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

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { title, description, fakePrice, price, category } = req.body;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (product.owner._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to update this product",
      });
    }

    const updateData = {
      title,
      description,
      category,
      fakePrice,
      price,
    };

    if (
      !req.files ||
      !req.files.productImages ||
      req.files.productImages.length === 0
    ) {
      return res.status(400).json({
        message: "No images were uploaded",
      });
    }

    const publicIds = product.productImages.map((image) => {
      const imagePathPublicId = image.split("/").pop().split(".")[0];
      return imagePathPublicId;
    });

    console.log("publicIds to be deleted:", publicIds);

    await fileDeleteOnCloudinary(publicIds);

    
    const productImages = await Promise.all(
      req.files.productImages.map(async (file) => {
        const productImagePath = file.path;

        const productImage = await fileUploadOnCloudinary(productImagePath);

        if (!productImage || !productImage.url) {
          throw new Error("One or more images could not be uploaded");
        }

        return productImage.url;
      })
    );

    updateData.productImages = productImages;

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error while updating product", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (product.owner._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to delete this product",
      });
    }

    const publicIds = product.productImages.map((image) => {
      const imagePathPublicId = image.split("/").pop().split(".")[0];
      return imagePathPublicId;
    });

    console.log("publicIds to be deleted:", publicIds); // Log publicIds for debugging

    await fileDeleteOnCloudinary(publicIds);

    await Product.findByIdAndDelete(id);

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error while deleting product:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export {
  uploadProduct,
  getOwnerProducts,
  getProductById,
  getAllProduct,
  updateProduct,
  deleteProduct,
};
