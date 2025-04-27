import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect admin to admin dashboard if they're not already there
  useEffect(() => {
    if (user?.role === "admin" && !location.pathname.startsWith("/admin")) {
      navigate("/admin");
    }
  }, [user, location.pathname, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          EventHub
        </Link>

        <nav className="hidden md:flex space-x-6">
          {/* Show regular nav links only for non-admin users */}
          {user?.role !== "admin" && (
            <>
              <NavLink
                to="/events"
                className={({ isActive }) =>
                  `hover:text-blue-600 ${
                    isActive ? "text-blue-600 font-medium" : "text-gray-600"
                  }`
                }
              >
                Events
              </NavLink>

              {isAuthenticated && (
                <NavLink
                  to="/my-tickets"
                  className={({ isActive }) =>
                    `hover:text-blue-600 ${
                      isActive ? "text-blue-600 font-medium" : "text-gray-600"
                    }`
                  }
                >
                  My Tickets
                </NavLink>
              )}
            </>
          )}

          {user?.role === "admin" && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `hover:text-blue-600 ${
                  isActive ? "text-blue-600 font-medium" : "text-gray-600"
                }`
              }
            >
              Admin Panel
            </NavLink>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <span className="hidden sm:inline text-gray-600">
                Hi, {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md text-gray-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md text-gray-700"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
