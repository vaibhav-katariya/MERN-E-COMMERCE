import axios from "axios";
import React, { useRef, useState } from "react";
import { BsCloudUpload } from "react-icons/bs";

const UploadProduct = () => {
  const [data, setData] = useState({
    title: "",
    description: "",
    price: 0,
    fakePrice: 0,
    category: "",
  });
  const [message, setMessage] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const imageRef = useRef();

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("fakePrice", data.fakePrice);
    formData.append("category", data.category);
    
    images.forEach((image) => {
      formData.append("productImages", image);
    });

    try {
      const res = await axios.post("/api/v1/product/upload", formData);
      if (res.data) {
        setMessage("Product uploaded successfully!");
        setData({
          title: "",
          description: "",
          price: 0,
          fakePrice: 0,
          category: "",
        });
        setImages([]);
        setImagePreviews([]);
      }
    } catch (error) {
      console.log(error);
      setMessage("Failed to upload product");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const filePreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(filePreviews);
  };

  return (
    <div className="h-full w-full text-zinc-800 flex flex-col justify-center items-center overflow-hidden">
      <form
        onSubmit={submitHandler}
        className="overflow-hidden border-[1px] md:w-1/2 border-zinc-400 md:p-10 rounded-lg p-5"
      >
        <h2 className="text-center mb-3 text-2xl text-zinc-400 font-semibold">
          Upload Product
        </h2>
        <div>
          <input
            value={data.title}
            onChange={handleChange}
            className="border-[1px] border-zinc-300 w-full px-3 py-2 placeholder:text-lg my-3 rounded-lg outline-none"
            type="text"
            name="title"
            placeholder="Title"
            id="title"
          />
        </div>
        <div>
          <textarea
            className="border-[1px] border-zinc-300 w-full resize-none px-3 py-2 placeholder:text-lg my-3 rounded-lg outline-none"
            name="description"
            placeholder="Description"
            id="description"
            rows={4}
            value={data.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            value={data.fakePrice}
            onChange={handleChange}
            className="border-[1px] border-zinc-300 w-full px-3 py-2 placeholder:text-lg my-3 rounded-lg outline-none"
            type="number"
            name="fakePrice"
            placeholder="Old Price"
            inputMode="numeric"
          />
        </div>
        <div>
          <input
            value={data.price}
            onChange={handleChange}
            className="border-[1px] border-zinc-300 w-full px-3 py-2 placeholder:text-lg my-3 rounded-lg outline-none"
            type="number"
            name="price"
            placeholder="New Price"
            inputMode="numeric"
          />
        </div>
        <div>
          <input
            className="border-[1px] border-zinc-300 w-full px-3 py-2 placeholder:text-lg my-3 rounded-lg outline-none"
            type="text"
            placeholder="Category"
            name="category"
            id="category"
            value={data.category}
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            hidden
            ref={imageRef}
            type="file"
            name="ProductImages"
            id="images"
            multiple
            onChange={handleFileChange}
          />
          <div
            className="cursor-pointer text-zinc-400 border-[1px] my-2 border-zinc-300 p-2 flex items-center gap-2 rounded-lg"
            onClick={() => imageRef.current.click()}
          >
            <BsCloudUpload /> Upload Product Images
          </div>
        </div>
        <div>
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {imagePreviews.map((preview, index) => (
                <img
                  key={index}
                  className="h-32 md:h-48 w-full object-cover rounded-lg"
                  src={preview}
                  alt={`Product Preview ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
        <button
          type="submit"
          className="py-2 w-full px-3 rounded-lg text-md text-white font-semibold mt-5 bg-blue-500"
        >
          Upload Product
        </button>
        <p className="my-2 text-center">{message}</p>
      </form>
    </div>
  );
};

export default UploadProduct;
