import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRoom, submitVote } from "@/services/roomService";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

interface RoomOption {
  text: string;
  votes: number;
  justification: string[];
}

interface RoomData {
  id: string;
  creator: string;
  title: string;
  description: string;
  options: RoomOption[];
  deadline: string;
  voters: string[];
  createdAt: string;
  updatedAt: string;
}

const RoomPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [room, setRoom] = useState<RoomData | null>(null);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(
    null
  );
  const [voteJustification, setVoteJustification] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showTally, setShowTally] = useState<boolean>(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (roomId) {
      getRoom(roomId)
        .then(setRoom)
        .catch(() => setErrorMessage("Room not found or failed to load."));
    }
  }, [roomId]);

  const handleVoteSubmission = async () => {
    if (selectedOptionIndex === null) {
      setErrorMessage("Please select an option to vote.");
      return;
    }

    const voterIdentifier = user?.id || generateGuestIdentifier();

    try {
      await submitVote(roomId!, {
        optionIndex: selectedOptionIndex,
        justification: voteJustification,
        voterId: voterIdentifier,
      });
      setSuccessMessage("Your vote was recorded!");
      setErrorMessage("");
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message || "Failed to submit vote."
      );
    }
  };

  const generateGuestIdentifier = (): string => {
    const storedIdentifier = localStorage.getItem("guestId");
    if (storedIdentifier) return storedIdentifier;
    const newIdentifier = crypto.randomUUID();
    localStorage.setItem("guestId", newIdentifier);
    return newIdentifier;
  };

  if (errorMessage) {
    return <p className="text-red-600 text-center mt-8">{errorMessage}</p>;
  }

  if (!room) {
    return <p className="text-center mt-8">Loading room...</p>;
  }

  return (
    <motion.div
      className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-xl mt-10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-2xl font-bold text-purple-800 mb-4">{room.title}</h1>
      <p className="mb-6 text-gray-700">{room.description}</p>

      <div className="space-y-4 mb-6">
        {room.options.map((option: RoomOption, index: number) => (
          <div key={index}>
            <label
              className={`block p-3 border rounded-lg cursor-pointer transition-all ${
                selectedOptionIndex === index
                  ? "border-purple-600 bg-purple-50"
                  : "border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="voteOption"
                value={index}
                checked={selectedOptionIndex === index}
                onChange={() => setSelectedOptionIndex(index)}
                className="mr-2"
              />
              {option.text}
            </label>

            {showTally && (
              <div className="text-sm text-purple-500 ml-4 mt-1">
                {option.votes} vote{option.votes !== 1 ? "s" : ""}
              </div>
            )}
          </div>
        ))}
      </div>

      <textarea
        placeholder="Optional justification..."
        className="w-full p-3 border rounded-md mb-4"
        rows={3}
        value={voteJustification}
        onChange={(event) => setVoteJustification(event.target.value)}
      />

      <button
        onClick={handleVoteSubmission}
        className="bg-purple-600 hover:bg-purple-700 text-white w-full py-3 rounded-lg font-medium transition mb-3"
      >
        Submit Vote
      </button>

      <div className="flex justify-between items-center text-sm">
        <button
          onClick={() => navigate(`/results/${room.id}`)}
          className="text-purple-600 hover:underline"
        >
          View Full Results →
        </button>

        <button
          onClick={() => setShowTally((previous) => !previous)}
          className="text-purple-500 hover:text-purple-700"
        >
          {showTally ? "Hide Live Tally" : "Show Live Tally"}
        </button>
      </div>

      {successMessage && (
        <p className="mt-4 text-green-600">{successMessage}</p>
      )}
      {errorMessage && <p className="mt-4 text-red-600">{errorMessage}</p>}
    </motion.div>
  );
};

export default RoomPage;
