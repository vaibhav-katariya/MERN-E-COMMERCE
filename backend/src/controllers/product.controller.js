import { Product } from "../model/product.model.js";
import { User } from "../model/user.model.js";
import { apiFeatures } from "../utils/apiFeatures.js";
import {
  fileDeleteOnCloudinary,
  fileUploadOnCloudinary,
} from "../utils/fileUploader.js";

const uploadProduct = async (req, res) => {
  const { title, description, fakePrice, price, category, rating , stock } = req.body;
  try {
    if (!title || !description || !fakePrice || !price || !category || !stock) {
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

    const user = await User.findById(req.user?._id);
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    if (user.role === "user") {
      return res.status(400).json({
        message: "You are not authorized to upload products",
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
      stock
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

const getProductCategoryProduct = async (req, res) => {
  try {
    const productCategory = await Product.distinct("category");

    const categoryProduct = [];

    for (const category of productCategory) {
      const product = await Product.findOne({ category });

      if (product) {
        categoryProduct.push(product);
      }
    }

    res.status(200).json({
      message: "Category products fetched successfully",
      categoryProduct,
    });
  } catch (error) {
    console.log("error while get product", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    if (!category) {
      return res.status(400).json({
        message: "Category is required",
      });
    }

    const data = await Product.find({ category }).populate({
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

// get all product (admin)
const getAllProduct = async (req, res) => {
  try {
    const user = await User.findById(req.user?._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        message: "You are not authorized to perform this action",
      });
    }

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
  const { title, description, fakePrice, price, category , stock } = req.body;

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
      stock
    };

    // if (
    //   !req.files ||
    //   !req.files.productImages ||
    //   req.files.productImages.length === 0
    // ) {
    //   return res.status(400).json({
    //     message: "No images were uploaded",
    //   });
    // }

    if (req.files) {
      const publicIds = product.productImages.map((image) => {
        const imagePathPublicId = image.split("/").pop().split(".")[0];
        return imagePathPublicId;
      });
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
    }

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

// add filter
const getProduct = async (req, res) => {
  const resultPerPage = 6;

  const productCount = await Product.countDocuments();

  const ApiFeatures = new apiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);

  let products = await ApiFeatures.query;

  const filterProductCount = products.length;

  res.status(200).json({
    success: true,
    products,
    productCount,
    resultPerPage,
    filterProductCount,
  });
};

const createProductReview = async (req, res) => {
  const { productId } = req.params;
  const { rating, comment } = req.body;

  const product = await Product.findById(productId);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  const isReviewed = product.reviews.find(
    (rev) => rev.user._id.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user._id.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    const review = {
      user: req.user._id,
      rating: rating,
      comment: comment,
    };
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let totalRating = 0;

  product.reviews.forEach((rev) => (totalRating += rev.rating));

  product.ratings = totalRating / product.reviews.length;

  await product.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    message: "review created successfully",
  });
};

const getProductReview = async (req, res) => {
  const { productId } = req.params;
  const product = await Product.findById(productId).populate({
    path: "reviews",
    populate: {
      path: "user",
      select: "username avatar",
    },
  });
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }
  res.status(200).json({
    success: true,
    message: "Product reviews found",
    data: product.reviews,
  });
};

const deleteProductReview = async (req, res) => {
  const { productId, reviewId } = req.params;
  const product = await Product.findById(productId);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== reviewId.toString()
  );

  let totalRating = 0;

  reviews.forEach((rev) => (totalRating += rev.rating));

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = totalRating / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    productId,
    {
      ratings,
      numOfReviews,
      reviews,
    },
    {
      new: true,
    }
  );
  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
};

export {
  uploadProduct,
  getOwnerProducts,
  getProductById,
  getAllProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getProductCategoryProduct,
  getProduct,
  createProductReview,
  getProductReview,
  deleteProductReview,
};
