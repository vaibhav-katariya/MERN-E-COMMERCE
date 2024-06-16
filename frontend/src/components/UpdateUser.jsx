import axios from "axios";
import React, { useRef, useState } from "react";
import { BsCloudUpload } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/userSlice";
const UpdateUser = () => {
  const user = useSelector((state) => state.user.user);
  console.log(user);
  const dispatch = useDispatch();
  const imageRef = useRef();
  const [data, setData] = useState({
    username: user?.username,
    email: user?.email,
    role: user?.role,
  });
  const [message, setMessage] = useState("");
  const [newAvatar, setNewAvatar] = useState();

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("role", data.role);

    if (newAvatar) {
      formData.append("avatar", newAvatar);
    }

    try {
      const res = await axios.put("/api/v1/user/update-user-details", formData);

      if (res.data) {
        console.log(res.data.updateUser);
        dispatch(login(res.data.updateUser));
        setMessage("User updated successfully");
      }
    } catch (error) {
      console.log(error);
      setMessage("Failed to update user details");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewAvatar(file);
  };

  const handleChange = (e) => {
    setData((prevData) => ({ ...prevData, [e.target.name]: e.target.value }));
  };

  return (
    <div className="h-full w-full text-zinc-800 flex flex-col justify-center items-center">
      <form
        onSubmit={submitHandler}
        className="border-[1px] md:w-1/2  border-zinc-400 md:p-10 rounded-lg p-5"
      >
        <h2 className="text-center mb-3 text-2xl text-zinc-400 font-semibold">
          Update User Details
        </h2>
        <div>
          <input
            value={data.username}
            onChange={handleChange}
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
            className="border-[1px] border-zinc-300 w-full px-3  py-2 placeholder:text-lg my-3 rounded-lg  outline-none"
            type="email"
            name="email"
            placeholder="Email"
            id="email"
          />
        </div>
        <div>
          <select
            className="border-[1px] text-[#9EA4B0] font-bold border-zinc-300 w-full  px-3 py-2 placeholder:text-lg my-3 rounded-lg  outline-none"
            name="role"
            value={data.role}
            onChange={handleChange}
          >
            <option value="user">user</option>
            <option value="saler">saller</option>
          </select>
        </div>
        <div>
          <input
            hidden
            ref={imageRef}
            className="ms-4 "
            type="file"
            name="avatar"
            id="image"
            onChange={handleFileChange}
          />
          <div
            className="cursor-pointer text-zinc-400 border-[1px] my-2 border-zinc-300 p-2 flex items-center gap-2 rounded-lg"
            onClick={() => imageRef.current.click()}
          >
            <BsCloudUpload /> Upload Updated Profile Pic
          </div>
        </div>
        <button
          type="submit"
          className="py-2 w-full px-3 rounded-lg text-md text-white font-semibold mt-5 bg-blue-500"
        >
          Update Account
        </button>
        <p className="my-2 text-center">{message}</p>
      </form>
    </div>
  );
};

export default UpdateUser;
