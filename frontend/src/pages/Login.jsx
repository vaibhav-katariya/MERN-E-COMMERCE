import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../store/userSlice";
import MetaData from "../helpers/MetaData";
const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/v1/user/login", data);
      if (res.status === 200) {
        dispatch(login(res.data.loginUser));
        navigate("/");
      }
    } catch (error) {
      console.log("login error ", error);
    }
  };

  return (
    <div className="h-screen w-full text-zinc-800 flex flex-col justify-center items-center">
      <MetaData title="Shop-Trend-Sign-In" />
      <form
        onSubmit={submitHandler}
        className="border-[1px] md:w-1/2 border-zinc-400 md:p-10 rounded-lg w-[80%] p-5"
      >
        <h2 className="text-center mb-3 text-2xl text-zinc-400 font-semibold">
          Login
        </h2>
        <div>
          <input
            onChange={handleChange}
            value={data.email}
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
            onChange={handleChange}
            value={data.password}
            required
            className="border-[1px] border-zinc-300 w-full  px-3 py-2 placeholder:text-lg my-3 rounded-lg  outline-none"
            type="password"
            placeholder="Password"
            name="password"
            id="password"
          />
        </div>
        <button
          type="submit"
          className="py-2 w-full px-3 rounded-lg text-md text-white font-semibold mt-5 bg-zinc-600"
        >
          Login
        </button>
        <p className="my-2 text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 underline">
            sign-up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
