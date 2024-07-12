import React from "react";
import { Link } from "react-router-dom";
import ProfileLayout from "../components/ProfileLayout";
import { useSelector } from "react-redux";

const Profile = () => {
  const user = useSelector((state) => state.user.user);
  return (
    <div className="min-h-[87vh] w-[100%] font-semibold my-5 md:flex md:px-8 px-2 overflow-hidden">
      <div className="md:w-1/6  md:border-r-[1px] border-zinc-300 p-2">
        <h1 className="text-2xl border-b-[1px] pb-2 border-zinc-400">
          Account
        </h1>
        <div className="my-5">
          <Link to={"userProfile"}>
            <p className="border-[1px] p-2 my-3 border-zinc-300 hover:bg-zinc-100">
              Profile
            </p>
          </Link>
        </div>
        {(user?.role === "saler" || user?.role === "admin") && (
          <>
            <div className="my-5">
              <Link to={"uploadProduct"}>
                <p className="border-[1px] p-2 my-3 border-zinc-300 hover:bg-zinc-100">
                  Upload Product
                </p>
              </Link>
            </div>
            <div className="my-5">
              <Link to={"getAllProduct"}>
                <p className="border-[1px] p-2 my-3 border-zinc-300 hover:bg-zinc-100">
                  Get All Product
                </p>
              </Link>
            </div>
          </>
        )}
        {user.role === "admin" && (
          <>
            <div className="my-5">
              <Link to={"alluser"}>
                <p className="border-[1px] p-2 my-3 border-zinc-300 hover:bg-zinc-100">
                  All User
                </p>
              </Link>
            </div>
            <div className="my-5">
              <Link to={"allorders"}>
                <p className="border-[1px] p-2 my-3 border-zinc-300 hover:bg-zinc-100">
                  All Orders
                </p>
              </Link>
            </div>
          </>
        )}
        <div className="my-5">
          <Link to={"myOrders"}>
            <p className="border-[1px] p-2 my-3 border-zinc-300 hover:bg-zinc-100">
              My Orders
            </p>
          </Link>
        </div>
      </div>
      <div className="h-full w-full">
        <ProfileLayout />
      </div>
    </div>
  );
};

export default Profile;
