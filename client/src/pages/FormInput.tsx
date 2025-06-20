import { useState } from "react";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";

interface BaseProps {
  label: string;
  icon: LucideIcon;
  error?: string;
  className?: string;
  as?: "input" | "textarea";
}

type InputProps = BaseProps &
  InputHTMLAttributes<HTMLInputElement> & { as?: "input" };

type TextareaProps = BaseProps &
  TextareaHTMLAttributes<HTMLTextAreaElement> & { as: "textarea" };

type FormInputProps = InputProps | TextareaProps;

const FormInput: React.FC<FormInputProps> = ({
  label,
  icon: Icon,
  error,
  className = "",
  as = "input",
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword =
    as === "input" && "type" in props && props.type === "password";
  const inputType =
    isPassword && showPassword ? "text" : "type" in props ? props.type : "text";

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
            {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
            className={`w-full pl-10 pr-10 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${className} ${
              error ? "border-red-500" : ""
            }`}
          />
        ) : (
          <input
            type={inputType}
            {...(props as InputHTMLAttributes<HTMLInputElement>)}
            className={`w-full pl-10 pr-10 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${className} ${
              error ? "border-red-500" : ""
            }`}
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
