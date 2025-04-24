import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  console.log("AdminRoute user:", user.role); // Debugging line

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return user && user.role === "admin" ? children : <Navigate to="/" />;
};
export default AdminRoute;
