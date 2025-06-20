import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  ClipboardList,
  PlusCircle,
  LogOut,
  LogIn,
  UserPlus,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    toggleMenu();
  };

  return (
    <header
      className={`${
        isSticky ? "fixed top-0 left-0 right-0 z-50 shadow-xl" : "relative"
      } transition-all duration-300`}
    >
      <div className="bg-gradient-to-r from-purple-700 to-fuchsia-600 border-b border-white/10">
        <nav className="container mx-auto p-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                <svg
                  className="w-6 h-6 text-purple-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-100 to-pink-200">
                PollPulse
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-white/90 px-4 py-2">
                    Welcome, {user.username}
                  </span>
                  <Link
                    to="/profile"
                    className="text-white px-4 py-2 rounded-lg hover:bg-white/10 transition"
                  >
                    Your Rooms
                  </Link>
                  <Link
                    to="/create-room"
                    className="bg-white text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-100 transition font-medium shadow"
                  >
                    Create Room
                  </Link>
                  <button
                    onClick={logout}
                    className="text-white px-4 py-2 rounded-lg hover:bg-white/10 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-white px-4 py-2 rounded-lg hover:bg-white/10 transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-white px-4 py-2 rounded-lg hover:bg-white/10 transition"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-3 space-y-2 bg-purple-800 rounded-lg shadow-lg px-4 py-3">
              {user ? (
                <>
                  <div className="text-white font-medium">
                    Welcome, {user.username}
                  </div>
                  <Link
                    to="/profile"
                    onClick={toggleMenu}
                    className="flex items-center gap-2 text-white py-2 px-2 rounded-md hover:bg-purple-700 transition"
                  >
                    <ClipboardList className="w-4 h-4" />
                    Your Rooms
                  </Link>
                  <Link
                    to="/create-room"
                    onClick={toggleMenu}
                    className="flex items-center gap-2 text-white py-2 px-2 rounded-md hover:bg-purple-700 transition"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Create Room
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-white w-full text-left py-2 px-2 rounded-md hover:bg-purple-700 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={toggleMenu}
                    className="flex items-center gap-2 text-white py-2 px-2 rounded-md hover:bg-purple-700 transition"
                  >
                    <LogIn className="w-4 h-4" />
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={toggleMenu}
                    className="flex items-center gap-2 text-white py-2 px-2 rounded-md hover:bg-purple-700 transition"
                  >
                    <UserPlus className="w-4 h-4" />
                    Register
                  </Link>
                </>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
