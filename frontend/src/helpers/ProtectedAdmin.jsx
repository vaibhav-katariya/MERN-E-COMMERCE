import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

const ProtectedAdmin = ({ children }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);

  if (user.role !== "admin") {
    return navigate("/");
  }

  return children;
};

export default ProtectedAdmin;
