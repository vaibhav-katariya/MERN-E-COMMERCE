import React from "react";
import { Link } from "react-router-dom";
import SettingLayout from "../components/SettingLayout";

const Settings = () => {
  return (
    <div className="min-h-[40vh] w-full font-semibold my-5 md:flex px-8">
      <div className="md:w-1/6  md:border-r-[1px] border-zinc-300 p-2">
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
      <div className="w-full h-full md:my-5 ">
        <SettingLayout />
      </div>
    </div>
  );
};

export default Settings;
