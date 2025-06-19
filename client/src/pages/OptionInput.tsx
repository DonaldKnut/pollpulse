interface OptionInputProps {
  value: string;
  index: number;
  onChange: (index: number, value: string) => void;
  onRemove: (index: number) => void;
  showRemove: boolean;
  disabled?: boolean;
}

const OptionInput: React.FC<OptionInputProps> = ({
  value,
  index,
  onChange,
  onRemove,
  showRemove,
  disabled,
}) => {
  return (
    <div className="flex mb-2 items-center">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(index, e.target.value)}
        className="flex-1 p-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        required
        disabled={disabled}
      />
      {showRemove && (
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="ml-2 p-2 text-purple-600 hover:text-purple-800 rounded-full hover:bg-purple-100 transition-colors"
          aria-label="Remove option"
          disabled={disabled}
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

import { X } from "lucide-react";

export default OptionInput;
