import { useEffect } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";

type NotificationProps = {
  message: string;
  type: "success" | "error";
  onClose: () => void;
  duration?: number;
};

export const Notification = ({
  message,
  type,
  onClose,
  duration = 3000,
}: NotificationProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div
      className={`fixed top-6 right-6 z-50 animate-fadeIn transition-all backdrop-blur-md bg-white/30 ring-1 ${
        type === "success"
          ? "text-green-800 ring-green-200"
          : "text-red-800 ring-red-200"
      } rounded-xl shadow-xl p-4 min-w-[300px] max-w-md`}
    >
      <div className="flex items-start gap-3">
        {type === "success" ? (
          <CheckCircle2 className="h-6 w-6 mt-0.5 text-green-600" />
        ) : (
          <AlertCircle className="h-6 w-6 mt-0.5 text-red-600" />
        )}
        <div className="flex-1">
          <p className="font-semibold text-base">
            {type === "success" ? "Success" : "Error"}
          </p>
          <p className="text-sm">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors text-lg font-bold"
          aria-label="Close notification"
        >
          &times;
        </button>
      </div>
    </div>
  );
};
