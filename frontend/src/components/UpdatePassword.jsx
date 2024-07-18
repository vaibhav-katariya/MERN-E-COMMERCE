import axios from "axios";
import React, { useState } from "react";
import { GrFormViewHide } from "react-icons/gr";
import { BiShowAlt } from "react-icons/bi";
const UpdatePassword = () => {
  const [data, setData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [message, setMessage] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put("/api/v1/user/update-password", data);
      setMessage(res.data.message);
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((data) => ({ ...data, [name]: value }));
  };

  const toggleOldPasswordVisibility = () => {
    setShowOldPassword((prevState) => !prevState);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword((prevState) => !prevState);
  };

  return (
    <div className="w-full text-zinc-800 flex justify-center items-center">
      <form
        onSubmit={submitHandler}
        className="border-[1px] md:w-1/2 border-zinc-400 md:p-10 rounded-lg w-full p-5"
      >
        <h2 className="text-center mb-3 text-2xl text-zinc-400 font-semibold">
          Change Password
        </h2>
        <div className="relative">
          <input
            onChange={handleChange}
            value={data.oldPassword}
            required
            className="border-[1px] border-zinc-300 w-full px-3 py-2 placeholder:text-lg my-3 rounded-lg outline-none"
            type={showOldPassword ? "text" : "password"}
            placeholder="old password"
            name="oldPassword"
          />
          <button
            type="button"
            onClick={toggleOldPasswordVisibility}
            className="absolute right-3 top-6 text-zinc-600"
          >
            {showOldPassword ? (
              <BiShowAlt className="text-xl" />
            ) : (
              <GrFormViewHide className="text-xl" />
            )}
          </button>
        </div>
        <div className="relative">
          <input
            onChange={handleChange}
            value={data.newPassword}
            required
            className="border-[1px] border-zinc-300 w-full px-3 py-2 placeholder:text-lg my-3 rounded-lg outline-none"
            type={showNewPassword ? "text" : "password"}
            placeholder="new password"
            name="newPassword"
          />
          <button
            type="button"
            onClick={toggleNewPasswordVisibility}
            className="absolute right-3 top-6 text-zinc-600"
          >
            {showNewPassword ? (
              <BiShowAlt className="text-xl" />
            ) : (
              <GrFormViewHide className="text-xl" />
            )}
          </button>
        </div>
        <button
          type="submit"
          className="py-2 w-full px-3 rounded-lg text-md text-white font-semibold mt-5 bg-zinc-600"
        >
          Change Password
        </button>
        <p className="mt-2 text-center">{message}</p>
      </form>
    </div>
  );
};

export default UpdatePassword;
