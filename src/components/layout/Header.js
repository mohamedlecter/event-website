import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Redirect admin to admin dashboard if they're not already there
  useEffect(() => {
    if (user?.role === "admin" && !location.pathname.startsWith("/admin")) {
      navigate("/admin");
    }
  }, [user, location.pathname, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            GESCO e-tickets
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
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

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-gray-600">Hi, {user?.name}</span>
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

        {/* Mobile Navigation */}
        <div
          className={`md:hidden ${
            isMenuOpen ? "block" : "hidden"
          } mt-4 pb-4`}
        >
          <nav className="flex flex-col space-y-4">
            {user?.role !== "admin" && (
              <>
                <NavLink
                  to="/events"
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-md ${
                      isActive
                        ? "bg-blue-100 text-blue-600 font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Events
                </NavLink>

                {isAuthenticated && (
                  <NavLink
                    to="/my-tickets"
                    className={({ isActive }) =>
                      `block px-4 py-2 rounded-md ${
                        isActive
                          ? "bg-blue-100 text-blue-600 font-medium"
                          : "text-gray-600 hover:bg-gray-100"
                      }`
                    }
                    onClick={() => setIsMenuOpen(false)}
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
                  `block px-4 py-2 rounded-md ${
                    isActive
                      ? "bg-blue-100 text-blue-600 font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Admin Panel
              </NavLink>
            )}

            {isAuthenticated ? (
              <>
                <div className="px-4 py-2 text-gray-600">
                  Hi, {user?.name}
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2 px-4">
                <Link
                  to="/login"
                  className="block w-full text-center bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md text-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block w-full text-center bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
