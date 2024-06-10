import React, { useState } from "react";
import { Link } from "react-router-dom";
const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(data);
  };

  return (
    <div className="h-screen w-full text-zinc-800 flex flex-col justify-center items-center">
      <form
        onSubmit={submitHandler}
        className="border-[1px] md:w-1/2 border-zinc-300 md:p-10 rounded-lg p-5"
      >
        <h2 className="text-center mb-3 text-2xl text-zinc-400">Login</h2>
        <div>
          <input
            onChange={handleChange}
            value={data.email}
            required
            className="border-[1px] border-zinc-200 w-full px-3  py-2 placeholder:text-lg my-3 rounded-lg  outline-none"
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
            className="border-[1px] border-zinc-200 w-full  px-3 py-2 placeholder:text-lg my-3 rounded-lg  outline-none"
            type="password"
            placeholder="Password"
            name="password"
            id="password"
          />
        </div>
        <button
          type="submit"
          className="py-2 w-full px-3 rounded-lg text-md text-white font-semibold mt-5 bg-blue-500"
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
