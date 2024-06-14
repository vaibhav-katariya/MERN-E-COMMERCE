import React, { useTransition } from "react";
import { FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { logout } from "../store/userSlice";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const res = await axios.post("/api/v1/user/logout");
      console.log(res);
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.log("logout error", error);
    }
  };

  return (
    <div className="h-14 shadow-lg border-b-2 flex items-center justify-between px-8">
      <h1 className="text-xl font-semibold">MY STORE</h1>
      <div className="h-[1.5rem] flex items-center">
        <input
          type="text"
          name="search"
          placeholder="Search Products....."
          className="px-2 rounded-ss-lg border-e-0 rounded-es-lg outline-none py-1 border-[1px] border-zinc-700"
        />
        <button className="py-2 border-zinc-700 px-2 border-[1px] bg-zinc-700 text-white rounded-se-lg rounded-ee-lg">
          <FaSearch />
        </button>
      </div>
      <div className="flex items-center gap-5">
        {user && (
          <div className="overflow-hidden h-[2.5rem] w-[2.5rem] border-zinc-700 p-[0.2rem] border-[1px] rounded-full">
            <img
              className="h-full w-full rounded-full object-cover"
              src={user?.avatar}
              alt=""
            />
          </div>
        )}
        {user !== null ? (
          <div
            onClick={logoutHandler}
            className="py-1 text-white font-semibold cursor-pointer px-3 bg-zinc-700 rounded-lg"
          >
            Logout
          </div>
        ) : (
          <Link to={"/login"}>
            <div className="py-1 text-white font-semibold cursor-pointer px-3 bg-zinc-700 rounded-lg">
              Login
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
