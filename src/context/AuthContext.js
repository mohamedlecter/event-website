import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  loginUser,
  registerUser,
  getCurrentUser,
} from "../services/authService";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking authentication...");
        if (token) {
          const decoded = jwtDecode(token);
          console.log("Decoded token:", decoded);
          if (decoded.exp * 1000 < Date.now()) {
            logout();
            return;
          }
          const currentUser = await getCurrentUser(token);
          console.log("Fetched user:", currentUser);
          setUser(currentUser);
        }
      } catch (err) {
        console.error("Authentication error:", err);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [token]);

  const login = async (credentials) => {
    try {
      const { token, user } = await loginUser(credentials);
      localStorage.setItem("token", token);
      setToken(token);
      setUser(user);
      navigate(user.role === "admin" ? "/admin" : "/events");
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const register = async (userData) => {
    try {
      const { token, user } = await registerUser(userData);
      localStorage.setItem("token", token);
      setToken(token);
      setUser(user);
      navigate("/events");
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!token,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
