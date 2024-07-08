import * as React from "react";
import { FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { logout } from "../store/userSlice";
import { Link, Link as RouterLink, useNavigate } from "react-router-dom";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { IoCartSharp } from "react-icons/io5";

const Header = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [keyword, setKeyword] = React.useState("");

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search/${keyword}`);
  };

  const logoutHandler = async () => {
    try {
      await axios.post("/api/v1/user/logout");
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.log("logout error", error);
    }
  };

  return (
    <div className="overflow-hidden h-14 shadow-lg border-b-2 flex items-center justify-between md:px-8 px-2">
      <RouterLink to={"/"} style={{ textDecoration: "none", color: "inherit" }}>
        <Typography variant="h6">MY STORE</Typography>
      </RouterLink>
      <div className="h-[1.5rem] flex items-center">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          type="text"
          name="search"
          placeholder="Search Products....."
          className="px-2 rounded-ss-lg border-e-0 rounded-es-lg outline-none py-1 border-[1px] border-zinc-700 w-32 md:w-full ms-2"
        />
        <button
          onClick={handleSearch}
          className="py-2 border-zinc-700 px-2 border-[1px] bg-zinc-700 text-white rounded-se-lg rounded-ee-lg"
        >
          <FaSearch />
        </button>
      </div>
      <div className="flex items-center gap-2">
        <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
          <Tooltip title="Account">
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              {user ? (
                <Avatar sx={{ width: 32, height: 32 }}>
                  <img
                    className="h-full w-full object-cover"
                    src={user.avatar}
                    alt={user.username}
                  />
                </Avatar>
              ) : (
                <Avatar sx={{ width: 32, height: 32 }} />
              )}
            </IconButton>
          </Tooltip>
        </Box>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          {user ? (
            <>
              <RouterLink to={"/profile/userProfile"} style={{ textDecoration: "none", color: "inherit" }}>
                <MenuItem onClick={handleClose}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar src={user.avatar} alt={user.username} />
                    <Typography>{user.username}</Typography>
                  </Box>
                </MenuItem>
              </RouterLink>
              <Divider />
              <RouterLink to={"/setting/changeUserDetails"} style={{ textDecoration: "none", color: "inherit" }}>
                <MenuItem onClick={handleClose}>
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  Settings
                </MenuItem>
              </RouterLink>
              <MenuItem onClick={logoutHandler}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </>
          ) : (
            <MenuItem>
              <RouterLink to={"/login"} style={{ textDecoration: "none", color: "inherit" }}>
                Login
              </RouterLink>
            </MenuItem>
          )}
        </Menu>
        {user && (
          <Link to={"/cart"} className="text-3xl">
            <IoCartSharp />
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
