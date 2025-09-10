import React from 'react';

interface InputDateProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
  required?: boolean;
  className?: string;
  min?: string;
  max?: string;
}

export const InputDate: React.FC<InputDateProps> = ({
  id,
  value,
  onChange,
  error,
  label,
  required = false,
  className = '',
  min,
  max,
}) => {
  const inputId = id || `input-date-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && '*'}
        </label>
      )}
      <input
        type="date"
        id={inputId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        min={min}
        max={max}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};