import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRoom, submitVote } from "@/services/roomService";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { ClipboardCopy } from "lucide-react";
import { Notification } from "@/components/Notification"; // Adjust path as needed

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

// ✅ Generate a unique identifier for guest voters
const generateGuestIdentifier = (): string => {
  const storedIdentifier = localStorage.getItem("guestId");
  if (storedIdentifier) return storedIdentifier;
  const newIdentifier = crypto.randomUUID();
  localStorage.setItem("guestId", newIdentifier);
  return newIdentifier;
};

const RoomPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(
    null
  );
  const [voteJustification, setVoteJustification] = useState<string>("");
  const [showLiveTally, setShowLiveTally] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  const voterIdentifier = user?.id || generateGuestIdentifier();

  useEffect(() => {
    if (roomId) {
      getRoom(roomId)
        .then(setRoomData)
        .catch(() =>
          setNotification({
            message: "Room not found or failed to load.",
            type: "error",
          })
        );
    }
  }, [roomId]);

  const handleVoteSubmission = async () => {
    if (selectedOptionIndex === null) {
      setNotification({
        message: "Please select an option to vote.",
        type: "error",
      });
      return;
    }

    try {
      await submitVote(roomId!, {
        optionIndex: selectedOptionIndex,
        justification: voteJustification,
        voterId: voterIdentifier,
      });

      const updatedRoom = await getRoom(roomId!);
      setRoomData(updatedRoom);

      setNotification({
        message: "Your vote has been successfully submitted!",
        type: "success",
      });
    } catch (error: any) {
      const voteErrorMessage =
        error.response?.data?.message || "Failed to submit vote.";
      setNotification({ message: voteErrorMessage, type: "error" });
    }
  };

  const handleCopyRoomLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/room/${roomId}`);
    setCopiedLink(true);
    setNotification({
      message: "Link copied to clipboard!",
      type: "success",
    });
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (!roomData) {
    return <p className="text-center mt-8">Loading room...</p>;
  }

  const hasUserAlreadyVoted = roomData.voters.includes(voterIdentifier);

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <motion.div
        className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-xl mt-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-purple-800 mb-4">
          {roomData.title}
        </h1>
        <p className="mb-6 text-gray-700">{roomData.description}</p>

        <div className="space-y-4 mb-6">
          {roomData.options.map((option, index) => (
            <div key={index}>
              <label
                className={`block p-3 border rounded-lg cursor-pointer transition-all ${
                  selectedOptionIndex === index
                    ? "border-purple-600 bg-purple-50"
                    : "border-gray-300"
                } ${
                  hasUserAlreadyVoted ? "cursor-not-allowed opacity-70" : ""
                }`}
              >
                <input
                  type="radio"
                  name="voteOption"
                  value={index}
                  checked={selectedOptionIndex === index}
                  disabled={hasUserAlreadyVoted}
                  onChange={() => setSelectedOptionIndex(index)}
                  className="mr-2"
                />
                {option.text}
              </label>

              {showLiveTally && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm text-purple-500 ml-4 mt-1"
                >
                  {option.votes} vote{option.votes !== 1 ? "s" : ""}
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {!hasUserAlreadyVoted && (
          <>
            <textarea
              placeholder="Optional justification..."
              className="w-full p-3 border rounded-md mb-4"
              rows={3}
              value={voteJustification}
              onChange={(event) => setVoteJustification(event.target.value)}
            />

            <button
              onClick={handleVoteSubmission}
              className="w-full py-3 rounded-lg font-medium transition mb-3 bg-purple-600 hover:bg-purple-700 text-white"
            >
              Submit Vote
            </button>
          </>
        )}

        {hasUserAlreadyVoted && (
          <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg text-sm text-purple-700 mt-4">
            <p>✅ You have already voted. Share this link with others:</p>
            <div className="flex items-center gap-2 mt-2">
              <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                {`${window.location.origin}/room/${roomId}`}
              </code>
              <button
                onClick={handleCopyRoomLink}
                className="flex items-center gap-1 text-purple-600 hover:text-purple-800 text-sm"
              >
                <ClipboardCopy className="w-4 h-4" />
                {copiedLink ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center text-sm mt-6">
          <button
            onClick={() => navigate(`/results/${roomData.id}`)}
            className="text-purple-600 hover:underline"
          >
            View Full Results →
          </button>

          <button
            onClick={() => setShowLiveTally((previous) => !previous)}
            className="text-purple-500 hover:text-purple-700"
          >
            {showLiveTally ? "Hide Live Tally" : "Show Live Tally"}
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default RoomPage;
