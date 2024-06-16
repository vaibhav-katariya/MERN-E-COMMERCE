import React from "react";
import { Outlet } from "react-router";
import { Link } from "react-router-dom";

const Settings = () => {
  return (
    <div className="h-[87vh] w-full font-semibold  my-5 flex px-8">
      <div className="w-1/6 h-full border-r-[1px] border-zinc-300 p-2">
        <h1 className="text-2xl border-b-[1px] pb-2 border-zinc-400">
          Settings
        </h1>
        <div className="my-5">
          <Link to={"changePassword"}>
            <p className="border-[1px] p-2 my-3 border-zinc-300 hover:bg-zinc-100">
              Change Password
            </p>
          </Link>
          <Link to={"changeUserDetails"}>
            <p className="border-[1px] p-2 my-3 border-zinc-300 hover:bg-zinc-100">
              Update User
            </p>
          </Link>
        </div>
      </div>
      <div className="w-full h-full flex">
        <Outlet />
      </div>
    </div>
  );
};

export default Settings;
