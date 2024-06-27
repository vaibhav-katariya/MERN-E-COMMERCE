import axios from "axios";
import React, { useEffect, useState } from "react";

const Alluser = () => {
  const [allUser, setAllUser] = useState([]);
  const [updateRole, setUpdateRole] = useState([]);

  const fetchAllUser = async () => {
    try {
      const res = await axios.get("/api/v1/user/alluser");
      setAllUser(res.data.user);
      setUpdateRole(res.data.user);
    } catch (error) {
      console.log("error while fetch all user", error);
    }
  };

  useEffect(() => {
    fetchAllUser();
  }, []);

  const handlerInput = (e, id) => {
    const { name, value } = e.target;
    setUpdateRole((prev) => {
      return prev.map((item) => {
        if (item._id === id) {
          return { ...item, [name]: value };
        } else {
          return item;
        }
      });
    });
  };

  const handleUpdateRole = async (item) => {
    const [findUser] = updateRole.filter((user) => user._id === item._id);
    await axios
      .put("/api/v1/user/changeRole", {
        id: findUser._id,
        role: findUser.role,
      })
      .then(() => {
        fetchAllUser();
      })
      .catch((err) => {
        console.log("error while update role", err);
      });
  };

  const handleDeleteUser = async (id) => {
    await axios
      .delete(`/api/v1/user/deleteUser/${id}`)
      .then(() => {
        fetchAllUser();
      })
      .catch((err) => {
        console.log("error while delete user", err);
      });
  };

  return (
    <div className="text-gray-900">
      <div className="p-4 flex">
        <h1 className="text-3xl">Users</h1>
      </div>
      <div className="px-3 py-4 overflow-x-auto flex justify-center">
        <table className="w-full text-md bg-white shadow-md rounded mb-4">
          <tbody>
            <tr className="border-b">
              <th className="text-left p-3 px-5">Name</th>
              <th className="text-left p-3 px-5">Email</th>
              <th className="text-left p-3 px-5">Role</th>
              <th />
            </tr>
            {allUser?.map((item) => (
              <tr
                key={item._id}
                className="border-b hover:bg-orange-100 bg-gray-100"
              >
                <td className="p-3 px-5">
                  <input
                    type="text"
                    defaultValue={item.username}
                    className="bg-transparent"
                  />
                </td>
                <td className="p-3 px-5">
                  <input
                    type="text"
                    defaultValue={item.email}
                    className="bg-transparent"
                  />
                </td>
                <td className="p-3 px-5">
                  <select
                    name="role"
                    defaultValue={item.role}
                    onChange={(e) => handlerInput(e, item._id)}
                    className="bg-transparent"
                  >
                    <option value="user">user</option>
                    <option value="saler">saller</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td className="p-3 px-5 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleUpdateRole(item)}
                    className="mr-3 text-sm bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteUser(item._id)}
                    className="text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Alluser;
