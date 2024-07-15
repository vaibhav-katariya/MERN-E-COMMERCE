import React, { Fragment, useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

const Alluser = () => {
  const [allUser, setAllUser] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const fetchAllUser = async () => {
    try {
      const res = await axios.get("/api/v1/user/alluser");
      setAllUser(res.data.user);
    } catch (error) {
      console.log("error while fetching all users", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser({ ...currentUser, [name]: value });
  };

  const handleUpdateRole = async () => {
    try {
      await axios.put("/api/v1/user/changeRole", {
        id: currentUser.id,
        role: currentUser.role,
      });
      fetchAllUser();
      setOpen(false);
    } catch (error) {
      console.log("error while updating role", error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`/api/v1/user/deleteUser/${id}`);
      fetchAllUser();
    } catch (error) {
      console.log("error while deleting user", error);
    }
  };

  const handleEditClick = (user) => {
    setCurrentUser(user);
    setOpen(true);
  };

  useEffect(() => {
    fetchAllUser();
  }, []);

  const columns = [
    { field: "name", headerName: "Name", minWidth: 150, flex: 1 },
    { field: "email", headerName: "Email", minWidth: 200, flex: 1 },
    { field: "role", headerName: "Role", minWidth: 150, flex: 0.5 },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 150,
      flex: 0.3,
      sortable: false,
      renderCell: (params) => {
        return (
          <Fragment>
            <Button onClick={() => handleEditClick(params.row)}>
              <EditIcon className="text-zinc-700" />
            </Button>
            <Button onClick={() => handleDeleteUser(params.row.id)}>
              <DeleteIcon className="text-zinc-600" />
            </Button>
          </Fragment>
        );
      },
    },
  ];

  const rows = allUser.map((user) => ({
    id: user._id,
    name: user.username,
    email: user.email,
    role: user.role,
  }));

  return (
    <Fragment>
      <div className="my-5 mx-6 flex gap-5 items-center flex-wrap">
        <h2 className=" text-2xl">All Users ({allUser.length})</h2>
        <p>Admin : {allUser.filter((i) => i.role === 'admin').length}</p>
        <p>User : {allUser.filter((i) => i.role === 'user').length}</p>
        <p>Saller : {allUser.filter((i) => i.role === 'seller').length}</p>
      </div>
      <div className="px-5">
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
        />
      </div>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Update Role</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To update the role, please select the new role for the user.
          </DialogContentText>
          <FormControl fullWidth>
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              name="role"
              value={currentUser?.role}
              onChange={handleInputChange}
              label="Role"
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="seller">Seller</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateRole}>Update</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default Alluser;
