import { motion } from "framer-motion";
import {
  User,
  Mail,
  ClipboardList,
  ArrowRightCircle,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

interface Room {
  id: string;
  title: string;
  createdAt: string;
}

interface UserProfilePageProps {
  rooms: Room[];
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({ rooms }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <motion.div
      className="max-w-3xl mx-auto p-6 mt-8 bg-white rounded-xl shadow-lg"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h1
        className="text-3xl font-bold text-purple-700 mb-6 flex items-center gap-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <User className="w-7 h-7 text-purple-500" />
        Your Profile
      </motion.h1>

      <motion.div
        className="space-y-2 mb-8"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
      >
        <motion.p className="flex items-center gap-2 text-purple-700">
          <User className="w-5 h-5" /> {user?.username}
        </motion.p>
        <motion.p className="flex items-center gap-2 text-purple-700">
          <Mail className="w-5 h-5" /> {user?.email}
        </motion.p>
      </motion.div>

      <motion.div
        className="bg-purple-50 p-4 rounded-lg border border-purple-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-lg font-semibold mb-3 text-purple-800 flex items-center gap-2">
          <ClipboardList className="w-5 h-5" />
          Your Created Rooms
        </h2>
        {rooms.length > 0 ? (
          <ul className="space-y-2">
            {rooms.map((room) => (
              <li
                key={room.id}
                className="bg-white p-3 rounded-lg shadow-sm border flex justify-between items-center"
              >
                <div>
                  <h3 className="font-medium text-purple-700">{room.title}</h3>
                  <p className="text-sm text-purple-400">
                    Created: {new Date(room.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/room/${room.id}`)}
                  className="flex items-center gap-1 text-purple-600 hover:underline"
                >
                  View <ArrowRightCircle className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-purple-600">You haven’t created any rooms yet.</p>
        )}
      </motion.div>

      <motion.div
        className="mt-6 flex justify-end"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <button
          onClick={handleLogout}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </motion.div>
    </motion.div>
  );
};

export default UserProfilePage;
