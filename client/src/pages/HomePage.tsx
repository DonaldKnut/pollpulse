import { Link } from "react-router-dom";
import { Vote, LogIn, UserPlus, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth"; // Custom hook to check auth state
import { Notification } from "@/components/Notification";
import { useState } from "react";

const HomePage: React.FC = () => {
  const { user, logout } = useAuth();
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleLogout = () => {
    logout();
    setNotification({
      message: "You've been logged out successfully",
      type: "success",
    });
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="text-center max-w-3xl">
        {/* Dynamic Illustration */}
        <div className="mx-auto w-64 h-64 bg-gradient-to-br from-purple-100 to-purple-50 rounded-full flex items-center justify-center mb-8 relative group">
          <Vote className="w-32 h-32 text-purple-600" strokeWidth={1.5} />
          {user && (
            <div className="absolute inset-0 bg-purple-600/10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-purple-800 font-medium">
                Welcome back, {user.username}!
              </span>
            </div>
          )}
        </div>

        {/* Dynamic Heading */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-800">
            {user ? `Welcome back to ` : `Welcome to `}
          </span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
            PollPulse
          </span>
        </h1>

        <p className="text-lg md:text-xl text-purple-700/90 mb-8 max-w-2xl mx-auto">
          {user
            ? "Ready to create your next poll or join an existing one?"
            : "Create or join decision rooms to vote anonymously with end-to-end encrypted results."}
        </p>

        {/* Dynamic Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <Link
            to="/create-room"
            className="relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium text-white transition-all duration-300 rounded-xl group bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl"
          >
            <span className="absolute inset-0 border-0 group-hover:border-[25px] ease-linear duration-100 transition-all border-white/10 rounded-xl"></span>
            <span className="relative flex items-center gap-2">
              <Vote className="w-5 h-5" />
              Create Room
            </span>
          </Link>

          {user ? (
            <>
              <Link
                to="/profile"
                className="relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium text-purple-700 transition-all duration-300 rounded-xl group bg-purple-50 hover:bg-purple-100 shadow-md hover:shadow-lg"
              >
                <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                <span className="relative flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium text-purple-700 transition-all duration-300 rounded-xl group bg-purple-50 hover:bg-purple-100 shadow-md hover:shadow-lg"
              >
                <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                <span className="relative flex items-center gap-2">
                  <LogOut className="w-5 h-5" />
                  Logout
                </span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium text-purple-700 transition-all duration-300 rounded-xl group bg-purple-50 hover:bg-purple-100 shadow-md hover:shadow-lg"
              >
                <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                <span className="relative flex items-center gap-2">
                  <LogIn className="w-5 h-5" />
                  Login
                </span>
              </Link>
              <Link
                to="/register"
                className="relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium text-purple-700 transition-all duration-300 rounded-xl group bg-purple-50 hover:bg-purple-100 shadow-md hover:shadow-lg"
              >
                <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                <span className="relative flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Register
                </span>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
