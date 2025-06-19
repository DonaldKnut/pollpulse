// src/components/common/FormInput.tsx
import { useState } from "react";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;
type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

interface BaseFormInputProps {
  label: string;
  icon: LucideIcon;
  error?: string;
  as?: "input" | "textarea";
}

type FormInputProps = BaseFormInputProps &
  (({ as?: "input" } & InputProps) | ({ as: "textarea" } & TextareaProps));

const FormInput: React.FC<FormInputProps> = ({
  label,
  icon: Icon,
  type,
  error,
  className = "",
  as = "input",
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="mb-5">
      <label className="block text-purple-700 text-sm font-medium mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-purple-400" />
        </div>
        {as === "textarea" ? (
          <textarea
            className={`w-full pl-10 pr-10 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${className} ${
              error ? "border-red-500" : ""
            }`}
            {...(props as TextareaProps)}
          />
        ) : (
          <input
            type={inputType}
            className={`w-full pl-10 pr-10 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${className} ${
              error ? "border-red-500" : ""
            }`}
            {...(props as InputProps)}
          />
        )}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-purple-400" />
            ) : (
              <Eye className="h-5 w-5 text-purple-400" />
            )}
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default FormInput;
