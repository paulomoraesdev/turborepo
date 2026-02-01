import type { SelectHTMLAttributes } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
}

export function Select({
  label,
  error,
  helperText,
  options,
  placeholder,
  className = '',
  id,
  ...props
}: SelectProps) {
  const selectId = id || `select-${Math.random().toString(36).slice(2, 9)}`;
  const hasError = Boolean(error);

  return (
    <div className={`ui-select-wrapper ${className}`.trim()}>
      {label ? (
        <label htmlFor={selectId} className="ui-select__label">
          {label}
        </label>
      ) : null}
      <select
        id={selectId}
        className={`ui-select ${hasError ? 'ui-select--error' : ''}`}
        aria-invalid={hasError}
        aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined}
        {...props}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <span id={`${selectId}-error`} className="ui-select__error">
          {error}
        </span>
      ) : null}
      {helperText && !error ? (
        <span id={`${selectId}-helper`} className="ui-select__helper">
          {helperText}
        </span>
      ) : null}
    </div>
  );
}
