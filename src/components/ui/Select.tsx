import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cva } from 'class-variance-authority';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: boolean;
  id?: string;
}

const selectVariants = cva(
  'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer flex items-center justify-between transition-colors',
  {
    variants: {
      error: {
        true: 'border-red-500',
        false: 'border-gray-300',
      },
      disabled: {
        true: 'bg-gray-100 cursor-not-allowed opacity-50',
        false: 'bg-white hover:border-gray-400',
      },
    },
    defaultVariants: {
      error: false,
      disabled: false,
    },
  }
);

const dropdownVariants = cva(
  'absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto',
  {
    variants: {
      open: {
        true: 'opacity-100 visible',
        false: 'opacity-0 invisible',
      },
    },
  }
);

export function Select({
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  disabled = false,
  className,
  error = false,
  id,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(option => option.value === value);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <div
        id={id}
        className={selectVariants({ error, disabled, className })}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </div>

      <div className={dropdownVariants({ open: isOpen })}>
        <ul role="listbox" className="py-1">
          {options.map(option => (
            <li
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              className={`px-3 py-2 cursor-pointer hover:bg-gray-100 transition-colors ${
                option.value === value ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
              }`}
              onClick={() => handleOptionClick(option.value)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}