import {Link, NavLink, useLocation, useNavigate} from "react-router-dom";
import {useAuth} from "../../context/AuthContext";
import {useEffect, useState} from "react";
import {FiLogOut, FiMenu, FiSearch, FiX} from "react-icons/fi";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);

  // Initialize search from URL params when component mounts or location changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setSearch(searchQuery);
    }
  }, [location.search]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      const searchParams = new URLSearchParams(location.search);
      searchParams.set('search', search.trim());
      
      if (!location.pathname.startsWith('/events')) {
        navigate(`/events?${searchParams.toString()}`);
      } else {
        navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
      }
      
      if (!location.pathname.startsWith('/events')) {
        setSearch("");
      }
      setIsMenuOpen(false);
    }
  };

  const handleClearSearch = () => {
    setSearch("");
    if (location.pathname.startsWith('/events')) {
      const searchParams = new URLSearchParams(location.search);
      searchParams.delete('search');
      navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
    setIsAdminMenuOpen(false);
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
                  className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-[#FBA415] focus:border-[#FBA415] outline-none text-gray-700 bg-white"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                {search && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}
                <button 
                  type="submit" 
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#FBA415] hover:text-[#FBA415]/80"
                  aria-label="Search"
                >
                  <FiSearch size={20} />
                </button>
              </div>
            </form>
          )}

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            {isAdmin ? (
              <>
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium ${
                      isActive
                        ? "bg-[#FBA415]/10 text-[#FBA415]"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/admin/events"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium ${
                      isActive
                        ? "bg-[#FBA415]/10 text-[#FBA415]"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  Manage Events
                </NavLink>
                <NavLink
                  to="/admin/payments"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium ${
                      isActive
                        ? "bg-[#FBA415]/10 text-[#FBA415]"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  Payments
                </NavLink>
                <NavLink
                  to="/admin/scanner"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium ${
                      isActive
                        ? "bg-[#FBA415]/10 text-[#FBA415]"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  Ticket Scanner
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="ml-2 px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium transition flex items-center space-x-2"
                >
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <NavLink to="/" className={({ isActive }) => `hover:text-[#FBA415] ${isActive ? "text-[#FBA415] font-semibold" : "text-gray-700"}`}>Home</NavLink>
                <NavLink to="/events" className={({ isActive }) => `hover:text-[#FBA415] ${isActive ? "text-[#FBA415] font-semibold" : "text-gray-700"}`}>Find Events</NavLink>
                <NavLink to="/contact" className={({ isActive }) => `hover:text-[#FBA415] ${isActive ? "text-[#FBA415] font-semibold" : "text-gray-700"}`}>Contact</NavLink>
                {isAuthenticated ? (
                  <>
                    <NavLink to="/my-tickets" className={({ isActive }) => `hover:text-[#FBA415] ${isActive ? "text-[#FBA415] font-semibold" : "text-gray-700"}`}>My Tickets</NavLink>
                    <button onClick={handleLogout} className="ml-2 px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium transition flex items-center space-x-2">
                      <FiLogOut />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <Link to="/login" className="ml-4 px-4 py-2 rounded-full border border-[#FBA415] text-[#FBA415] hover:bg-[#FBA415]/10 font-medium transition">Login</Link>
                )}
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FBA415]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
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
                  className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-[#FBA415] focus:border-[#FBA415] outline-none text-gray-700 bg-white"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                {search && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}
                <button 
                  type="submit" 
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#FBA415] hover:text-[#FBA415]/80"
                  aria-label="Search"
                >
                  <FiSearch size={20} />
                </button>
              </div>
            </form>
          )}
          <nav className="flex flex-col space-y-2 px-4 pb-4">
            {isAdmin ? (
              <>
                <NavLink to="/admin" className={({ isActive }) => `block py-2 ${isActive ? "text-[#FBA415] font-semibold" : "text-gray-700"}`} onClick={() => setIsMenuOpen(false)}>Dashboard</NavLink>
                <NavLink to="/admin/events" className={({ isActive }) => `block py-2 ${isActive ? "text-[#FBA415] font-semibold" : "text-gray-700"}`} onClick={() => setIsMenuOpen(false)}>Manage Events</NavLink>
                <NavLink to="/admin/payments" className={({ isActive }) => `block py-2 ${isActive ? "text-[#FBA415] font-semibold" : "text-gray-700"}`} onClick={() => setIsMenuOpen(false)}>Payments</NavLink>
                <NavLink to="/admin/scanner" className={({ isActive }) => `block py-2 ${isActive ? "text-[#FBA415] font-semibold" : "text-gray-700"}`} onClick={() => setIsMenuOpen(false)}>Ticket Scanner</NavLink>
                <button onClick={handleLogout} className="block w-full text-left py-2 text-gray-700 hover:bg-gray-100 font-medium flex items-center space-x-2">
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <NavLink to="/" className={({ isActive }) => `block py-2 ${isActive ? "text-[#FBA415] font-semibold" : "text-gray-700"}`} onClick={() => setIsMenuOpen(false)}>Home</NavLink>
                <NavLink to="/events" className={({ isActive }) => `block py-2 ${isActive ? "text-[#FBA415] font-semibold" : "text-gray-700"}`} onClick={() => setIsMenuOpen(false)}>Find Events</NavLink>
                <NavLink to="/contact" className={({ isActive }) => `block py-2 ${isActive ? "text-[#FBA415] font-semibold" : "text-gray-700"}`} onClick={() => setIsMenuOpen(false)}>Contact</NavLink>
                {isAuthenticated ? (
                  <>
                    <NavLink to="/my-tickets" className={({ isActive }) => `block py-2 ${isActive ? "text-[#FBA415] font-semibold" : "text-gray-700"}`} onClick={() => setIsMenuOpen(false)}>My Tickets</NavLink>
                    <button onClick={handleLogout} className="block w-full text-left py-2 text-gray-700 hover:bg-gray-100 font-medium flex items-center space-x-2">
                      <FiLogOut />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <Link to="/login" className="block py-2 text-[#FBA415] font-medium" onClick={() => setIsMenuOpen(false)}>Login</Link>
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
