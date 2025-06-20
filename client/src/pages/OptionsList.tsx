import OptionInput from "./OptionInput";
import { Plus, ListOrdered } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

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
      <label className="flex items-center text-purple-700 mb-1 font-medium gap-2">
        <ListOrdered className="w-5 h-5 text-purple-500" />
        Options (2–5)
      </label>

      <AnimatePresence initial={false}>
        {options.map((option, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25 }}
            layout
          >
            <OptionInput
              value={option}
              index={index}
              onChange={onOptionChange}
              onRemove={onRemoveOption}
              showRemove={options.length > 2}
              disabled={disabled}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {options.length < 5 && (
          <motion.div
            key="add-option"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25 }}
          >
            <button
              type="button"
              onClick={onAddOption}
              className="flex items-center gap-1 text-purple-600 hover:text-purple-800 mt-2 p-2 rounded-lg hover:bg-purple-50 transition-colors"
              disabled={disabled}
            >
              <Plus className="w-5 h-5" />
              Add Option
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OptionsList;
