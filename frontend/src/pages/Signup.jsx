import axios from "axios";
import React, { useRef, useState } from "react";
import { BsCloudUpload } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
const Signup = () => {
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [image, setImage] = useState(null);

  const imageRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("avatar", image);

    try {
      const res = await axios.post("/api/v1/user/register", formData);
      if (res.data) {
        navigate("/login");
      }
    } catch (error) {
      console.log("sign up error ", error);
    }
  };
  return (
    <div className="h-screen w-full text-zinc-800 flex flex-col justify-center items-center">
      <form
        onSubmit={submitHandler}
        className="border-[1px] md:w-1/2 border-zinc-400 md:p-10 rounded-lg p-5"
      >
        <h2 className="text-center mb-3 text-2xl text-zinc-400 font-semibold">
          Sign up
        </h2>
        <div>
          <input
            value={data.username}
            onChange={handleChange}
            required
            className="border-[1px] border-zinc-300 w-full  px-3 py-2 placeholder:text-lg my-3 rounded-lg  outline-none"
            type="text"
            name="username"
            placeholder="Name"
            id="name"
          />
        </div>
        <div>
          <input
            value={data.email}
            onChange={handleChange}
            required
            className="border-[1px] border-zinc-300 w-full px-3  py-2 placeholder:text-lg my-3 rounded-lg  outline-none"
            type="email"
            name="email"
            placeholder="Email"
            id="email"
          />
        </div>
        <div>
          <input
            value={data.password}
            onChange={handleChange}
            required
            className="border-[1px] border-zinc-300 w-full  px-3 py-2 placeholder:text-lg my-3 rounded-lg  outline-none"
            type="password"
            placeholder="Password"
            name="password"
            id="password"
          />
        </div>
        <div>
          <input
            required
            hidden
            ref={imageRef}
            className="ms-4"
            type="file"
            name="avatar"
            id="image"
            onChange={handleFileChange}
          />
          <div
            className=" text-zinc-400 border-[1px] my-2 border-zinc-300 p-2 flex items-center gap-2 rounded-lg"
            onClick={() => imageRef.current.click()}
          >
            <BsCloudUpload /> Upload Profile Pic
          </div>
        </div>
        <button
          type="submit"
          className="py-2 w-full px-3 rounded-lg text-md text-white font-semibold mt-5 bg-blue-500"
        >
          Creare Account
        </button>
        <p className="my-2 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
