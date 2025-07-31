import {Navigate} from "react-router-dom";
import {useAuth} from "../../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Check if user exists and has admin role
  return user?.role === "admin" ? children : <Navigate to="/" />;
};
export default AdminRoute;
