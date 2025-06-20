import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
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
      <div
        className={`backdrop-blur-lg bg-gradient-to-r from-purple-700/80 to-fuchsia-600/80 border-b border-white/10`}
      >
        <nav className="container mx-auto p-4">
          <div className="flex justify-between items-center">
            {/* Logo/Brand */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md group-hover:bg-white transition-colors duration-200">
                <svg
                  className="w-6 h-6 text-purple-600 group-hover:text-purple-700 transition-colors duration-200"
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
              <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-100 to-pink-200 group-hover:from-white group-hover:to-pink-100 transition-all duration-200">
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
                  <button
                    onClick={logout}
                    className="text-white hover:text-white transition-all duration-300 px-4 py-2 rounded-lg hover:bg-white/10 backdrop-blur-sm transform hover:scale-105"
                  >
                    Logout
                  </button>
                  <Link
                    to="/create-room"
                    className="bg-white/90 text-purple-700 px-4 py-2 rounded-lg hover:bg-white transition-all duration-300 font-medium shadow hover:shadow-md hover:scale-105 backdrop-blur-sm"
                  >
                    Create Room
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-white hover:text-white transition-all duration-300 px-4 py-2 rounded-lg hover:bg-white/10 backdrop-blur-sm transform hover:scale-105"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-white hover:text-white transition-all duration-300 px-4 py-2 rounded-lg hover:bg-white/10 backdrop-blur-sm transform hover:scale-105"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white focus:outline-none p-2 rounded-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm transform hover:scale-110"
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
            <div className="md:hidden mt-4 pb-2 space-y-2 animate-fadeIn backdrop-blur-lg bg-white/5 rounded-lg overflow-hidden">
              {user ? (
                <>
                  <div className="block py-3 px-4 text-white font-medium">
                    Welcome, {user.username}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left py-3 px-4 text-white rounded-lg hover:bg-white/10 transition-all duration-300 font-medium transform hover:translate-x-2"
                  >
                    Logout
                  </button>
                  <Link
                    to="/create-room"
                    className="block py-3 px-4 text-white rounded-lg bg-white/20 font-medium hover:bg-white/30 transition-all duration-300 mt-2 transform hover:translate-x-2"
                    onClick={toggleMenu}
                  >
                    Create Room
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block py-3 px-4 text-white rounded-lg hover:bg-white/10 transition-all duration-300 font-medium transform hover:translate-x-2"
                    onClick={toggleMenu}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block py-3 px-4 text-white rounded-lg hover:bg-white/10 transition-all duration-300 font-medium transform hover:translate-x-2"
                    onClick={toggleMenu}
                  >
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
