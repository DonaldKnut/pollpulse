import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  ClipboardList,
  ArrowRightCircle,
  LogOut,
  Info,
  PlusCircle,
  ClipboardCopy,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

interface Room {
  id: string;
  title: string;
  createdAt: string;
}

const UserProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedRoomId, setCopiedRoomId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch(`/api/rooms?userId=${user?.id}`);
        const data = await res.json();
        setRooms(data.rooms);
      } catch (err) {
        console.error("Failed to fetch rooms", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchRooms();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleCreateRoom = () => {
    navigate("/create-room");
  };

  const handleCopyLink = (roomId: string) => {
    const link = `${window.location.origin}/room/${roomId}`;
    navigator.clipboard.writeText(link);
    setCopiedRoomId(roomId);
    setTimeout(() => setCopiedRoomId(null), 2000);
  };

  if (!user) return null;
  if (loading) return <div>Loading your rooms...</div>;

  return (
    <motion.div
      className="max-w-3xl mx-auto p-6 mt-8 bg-white rounded-xl shadow-lg"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <motion.h1
        className="text-3xl font-bold text-purple-700 mb-6 flex items-center gap-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <User className="w-7 h-7 text-purple-500" />
        Your Profile
      </motion.h1>

      {/* User Info */}
      <motion.div
        className="space-y-2 mb-8"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.15 } },
        }}
      >
        <motion.p className="flex items-center gap-2 text-purple-700">
          <User className="w-5 h-5" /> {user.username}
        </motion.p>
        <motion.p className="flex items-center gap-2 text-purple-700">
          <Mail className="w-5 h-5" /> {user.email}
        </motion.p>
      </motion.div>

      {/* Room Section */}
      <motion.div
        className="bg-purple-50 p-4 rounded-lg border border-purple-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-2 mb-2 text-sm text-purple-700">
          <Info className="w-4 h-4" />
          <p>
            Rooms are where you create polls for others to vote anonymously.
            Each room has options, a deadline, and live results.
          </p>
        </div>

        <h2 className="text-lg font-semibold mb-3 text-purple-800 flex items-center gap-2 mt-4">
          <ClipboardList className="w-5 h-5" />
          Your Created Rooms
        </h2>

        {rooms.length > 0 ? (
          <ul className="space-y-2">
            {rooms.map((room) => (
              <li
                key={room.id}
                className="bg-white p-3 rounded-lg shadow-sm border"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-purple-700">
                      {room.title}
                    </h3>
                    <p className="text-sm text-purple-400">
                      Created: {new Date(room.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex gap-4 flex-wrap">
                  <button
                    onClick={() => handleCopyLink(room.id)}
                    className="flex items-center gap-1 text-purple-600 text-sm hover:underline"
                  >
                    {copiedRoomId === room.id ? (
                      <span className="text-green-600 font-medium">
                        Copied!
                      </span>
                    ) : (
                      <>
                        <ClipboardCopy className="w-4 h-4" />
                        Copy Link
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => navigate(`/room/${room.id}`)}
                    className="flex items-center gap-1 text-purple-600 text-sm hover:underline"
                  >
                    View <ArrowRightCircle className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-left text-purple-600 space-y-4">
            <p>You haven’t created any rooms yet.</p>
            <motion.button
              onClick={handleCreateRoom}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-2 inline-flex items-center gap-2 px-5 py-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition"
            >
              <PlusCircle className="w-5 h-5" />
              Create Your First Room
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* Logout Button */}
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
