import React from "react";
import { useSelector } from "react-redux";
const UserProfile = () => {
  const user = useSelector((state) => state.user.user);

  return (
    <div className="h-full overflow-hidden md:p-5 md:mx-5">
      <div className="mt-5 mx-2 flex items-center overflow-hidden gap-5 md:my-5 border-[1px] border-zinc-300 md:p-5">
        <img
          className="h-20 w-20 md:h-32 md:w-32 object-cover rounded-full"
          src={user?.avatar}
          alt={user?.username}
        />
        <div>
          <h1 className="text-3xl">{user?.username}</h1>
          <p className="text-lg">{user?.email}</p>
          <p>{user?.role}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
