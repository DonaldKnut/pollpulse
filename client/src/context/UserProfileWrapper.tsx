import React, { useEffect, useState } from "react";
import UserProfilePage from "@/pages/UserProfilePage";
import { useAuth } from "@/context/AuthContext";

interface Room {
  id: string;
  title: string;
  createdAt: string;
}

const UserProfileWrapper: React.FC = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div>Loading your profile...</div>;

  return <UserProfilePage rooms={rooms} />;
};

export default UserProfileWrapper;
