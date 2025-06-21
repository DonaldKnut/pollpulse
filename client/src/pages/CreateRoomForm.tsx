// src/components/forms/CreateRoomForm.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRoom } from "@/services/roomService";
import { Vote } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Notification } from "@/components/Notification";
import FormInput from "@/components/common/FormInput";
import OptionsList from "./OptionsList";
import type { NotificationState } from "@/types";

const CreateRoomForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [deadline, setDeadline] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<NotificationState | null>(
    null
  );
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    if (options.length < 5) setOptions([...options, ""]);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setNotification({
        message: "You must be logged in to create a room",
        type: "error",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await createRoom({
        title,
        description,
        options: options.filter((opt) => opt.trim() !== ""),
        deadline,
      });

      setNotification({
        message: "Room created successfully!",
        type: "success",
      });

      setTimeout(() => navigate(`/room/${response._id || response.id}`), 1500);
    } catch (err: unknown) {
      let errorMessage = "Failed to create room";
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "object" && err !== null && "response" in err) {
        const axiosError = err as {
          response?: { data?: { message?: string } };
        };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }

      setNotification({
        message: errorMessage,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg border border-purple-100">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 bg-purple-600/10 rounded-full flex items-center justify-center">
          <Vote className="w-12 h-12 text-purple-600" strokeWidth={1.5} />
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-purple-800 text-center">
        Create Decision Room
      </h2>

      {!user && (
        <div className="bg-purple-50 text-purple-800 p-3 rounded-lg mb-4">
          You need to be logged in to create a room. Please login or register.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="Title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={!user || isLoading}
          icon={Vote}
        />
        <FormInput
          label="Description"
          as="textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={3}
          disabled={!user || isLoading}
          icon={Vote}
        />
        <OptionsList
          options={options}
          onOptionChange={handleOptionChange}
          onAddOption={addOption}
          onRemoveOption={removeOption}
          disabled={!user || isLoading}
        />
        <FormInput
          label="Deadline"
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          required
          disabled={!user || isLoading}
          icon={Vote}
        />
        <button
          type="submit"
          className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-300 ${
            !user || isLoading
              ? "bg-purple-400 cursor-not-allowed opacity-50"
              : "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-md hover:shadow-lg"
          }`}
          disabled={!user || isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Creating Room...
            </span>
          ) : (
            "Create Room"
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateRoomForm;
