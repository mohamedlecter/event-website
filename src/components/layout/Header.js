import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { FiSearch } from "react-icons/fi";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/events?search=${encodeURIComponent(search)}`);
      setSearch("");
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  // Helper: is admin
  const isAdmin = user?.role === "admin";

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-3xl font-bold text-black tracking-tight">GESCO e-tickets</Link>
          </div>

          {/* Search bar (hidden on mobile) */}
          {!isAdmin && (
            <form
              onSubmit={handleSearch}
              className="hidden md:flex items-center mx-8 flex-1 max-w-md"
            >
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search for an event..."
                  className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none text-gray-700 bg-white"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-yellow-500 hover:text-yellow-600">
                  <FiSearch size={20} />
                </button>
              </div>
            </form>
          )}

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            {isAdmin ? (
              <NavLink to="/admin" className={({ isActive }) => `hover:text-yellow-600 ${isActive ? "text-yellow-600 font-semibold" : "text-gray-700"}`}>Admin Panel</NavLink>
            ) : (
              <>
                <NavLink to="/" className={({ isActive }) => `hover:text-yellow-600 ${isActive ? "text-yellow-600 font-semibold" : "text-gray-700"}`}>Home</NavLink>
                <NavLink to="/events" className={({ isActive }) => `hover:text-yellow-600 ${isActive ? "text-yellow-600 font-semibold" : "text-gray-700"}`}>Find Events</NavLink>
                <NavLink to="/contact" className={({ isActive }) => `hover:text-yellow-600 ${isActive ? "text-yellow-600 font-semibold" : "text-gray-700"}`}>Contact</NavLink>
                {isAuthenticated ? (
                  <>
                    <NavLink to="/my-tickets" className={({ isActive }) => `hover:text-yellow-600 ${isActive ? "text-yellow-600 font-semibold" : "text-gray-700"}`}>My Tickets</NavLink>
                    <button onClick={handleLogout} className="ml-2 px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium transition">Logout</button>
                  </>
                ) : (
                  <Link to="/login" className="ml-4 px-4 py-2 rounded-full border border-yellow-500 text-yellow-600 hover:bg-yellow-50 font-medium transition">Login</Link>
                )}
              </>
            )}
          </nav>

          {/* Hamburger for mobile */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          {/* Search bar for mobile (not for admin) */}
          {!isAdmin && (
            <form onSubmit={handleSearch} className="flex items-center px-4 py-3">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search for an event..."
                  className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none text-gray-700 bg-white"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-yellow-500 hover:text-yellow-600">
                  <FiSearch size={20} />
                </button>
              </div>
            </form>
          )}
          <nav className="flex flex-col space-y-2 px-4 pb-4">
            {isAdmin ? (
              <NavLink to="/admin" className={({ isActive }) => `block py-2 ${isActive ? "text-yellow-600 font-semibold" : "text-gray-700"}`} onClick={() => setIsMenuOpen(false)}>Admin Panel</NavLink>
            ) : (
              <>
                <NavLink to="/" className={({ isActive }) => `block py-2 ${isActive ? "text-yellow-600 font-semibold" : "text-gray-700"}`} onClick={() => setIsMenuOpen(false)}>Home</NavLink>
                <NavLink to="/events" className={({ isActive }) => `block py-2 ${isActive ? "text-yellow-600 font-semibold" : "text-gray-700"}`} onClick={() => setIsMenuOpen(false)}>Find Events</NavLink>
                <NavLink to="/contact" className={({ isActive }) => `block py-2 ${isActive ? "text-yellow-600 font-semibold" : "text-gray-700"}`} onClick={() => setIsMenuOpen(false)}>Contact</NavLink>
                {isAuthenticated ? (
                  <>
                    <NavLink to="/my-tickets" className={({ isActive }) => `block py-2 ${isActive ? "text-yellow-600 font-semibold" : "text-gray-700"}`} onClick={() => setIsMenuOpen(false)}>My Tickets</NavLink>
                    <button onClick={handleLogout} className="block w-full text-left py-2 text-gray-700 hover:bg-gray-100 font-medium" >Logout</button>
                  </>
                ) : (
                  <Link to="/login" className="block py-2 text-yellow-600 font-medium" onClick={() => setIsMenuOpen(false)}>Login</Link>
                )}
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
