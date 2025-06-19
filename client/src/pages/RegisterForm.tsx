import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/authService";
import { UserPlus, Mail, Lock, ArrowRight, User } from "lucide-react";
import FormInput from "@/components/common/FormInput";

interface NotificationState {
  message: string;
  type: "success" | "error";
}

const RegisterForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<NotificationState | null>(
    null
  );
  const navigate = useNavigate();

  const passwordsMatch = password === confirmPassword || !confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordsMatch) return;
    setIsLoading(true);

    try {
      const { token, user } = await register({ username, email, password });
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setNotification({
        message: `Account created successfully! Please login`,
        type: "success",
      });

      // Redirect to login page after 1.5 seconds
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      setNotification({
        message: err.message || "Registration failed",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 bg-purple-600/10 rounded-full flex items-center justify-center">
          <UserPlus className="w-12 h-12 text-purple-600" strokeWidth={1.5} />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-purple-100">
        <div className="p-8">
          <h2 className="text-3xl font-bold text-center text-purple-800 mb-2">
            Create Account
          </h2>
          <p className="text-center text-purple-600 mb-8">
            Join our voting community
          </p>

          <form onSubmit={handleSubmit}>
            <FormInput
              label="Username"
              icon={User}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="yourusername"
              required
              minLength={3}
            />
            <FormInput
              label="Email"
              icon={Mail}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
            <FormInput
              label="Password"
              icon={Lock}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
            <FormInput
              label="Confirm Password"
              icon={Lock}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              error={passwordsMatch ? undefined : "Passwords don't match"}
            />
            <button
              type="submit"
              disabled={isLoading || !passwordsMatch}
              className={`w-full py-3 px-4 rounded-xl font-medium text-white transition-all duration-300 ${
                isLoading || !passwordsMatch
                  ? "bg-purple-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-md hover:shadow-lg"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Register
                </span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-purple-600 hover:text-purple-800 font-medium transition-colors flex items-center justify-center gap-1"
            >
              Already have an account? Login <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
