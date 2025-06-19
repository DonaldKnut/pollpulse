import OptionInput from "./OptionInput";
import { Plus } from "lucide-react";

interface OptionsListProps {
  options: string[];
  onOptionChange: (index: number, value: string) => void;
  onAddOption: () => void;
  onRemoveOption: (index: number) => void;
  disabled?: boolean;
}

const OptionsList: React.FC<OptionsListProps> = ({
  options,
  onOptionChange,
  onAddOption,
  onRemoveOption,
  disabled,
}) => {
  return (
    <div className="mb-4">
      <label className="block text-purple-700 mb-1 font-medium">
        Options (2-5)
      </label>
      {options.map((option, index) => (
        <OptionInput
          key={index}
          value={option}
          index={index}
          onChange={onOptionChange}
          onRemove={onRemoveOption}
          showRemove={options.length > 2}
          disabled={disabled}
        />
      ))}
      {options.length < 5 && (
        <button
          type="button"
          onClick={onAddOption}
          className="flex items-center gap-1 text-purple-600 hover:text-purple-800 mt-2 p-2 rounded-lg hover:bg-purple-50 transition-colors"
          disabled={disabled}
        >
          <Plus className="w-5 h-5" />
          Add Option
        </button>
      )}
    </div>
  );
};

export default OptionsList;
