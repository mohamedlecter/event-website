import {createContext, useCallback, useContext, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {getCurrentUser, loginUser, registerUser,} from "../services/authService";
import {jwtDecode} from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Enhanced token validation
  const validateToken = useCallback((token) => {
    try {
      if (!token) return false;
      const decoded = jwtDecode(token);
      const isValid = decoded.exp * 1000 > Date.now();
      return isValid;
    } catch (err) {
      console.error("Token validation error:", err);
      return false;
    }
  }, []);

  // Enhanced authentication check
  const checkAuth = useCallback(async () => {
    try {
      if (!token) return false;

      // Check if current token is valid
      if (validateToken(token)) {
        const currentUser = await getCurrentUser(token);
        setUser(currentUser);
        return true;
      }

      // If token is invalid, log out
      logout();
      return false;
    } catch (err) {
      console.error("Auth check failed:", err);
      logout();
      return false;
    }
  }, [token, validateToken]);

  // Initial auth check
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await checkAuth();
      } catch (err) {
        console.error("Initial auth check failed:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [token, checkAuth]);

  const login = async (credentials) => {
    try {
      const { token: newToken, user } = await loginUser(credentials);
      localStorage.setItem("token", newToken);
      setToken(newToken);
      setUser(user);
      setError(null);

      const params = new URLSearchParams(location.search);
      const returnUrl = params.get('returnUrl') || location.state?.from?.pathname || "/events";
      navigate(returnUrl, { replace: true });
      return { success: true, user };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const register = async (userData) => {
    try {
      const { token: newToken, user } = await registerUser(userData);
      localStorage.setItem("token", newToken);
      setToken(newToken);
      setUser(user);
      setError(null);
      navigate("/events");
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setError(null);
    navigate("/");
  }, [navigate]);

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
        checkAuth,
        isAuthenticated: !!token && validateToken(token),
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);