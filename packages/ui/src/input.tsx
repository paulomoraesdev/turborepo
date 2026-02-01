import type { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).slice(2, 9)}`;
  const hasError = Boolean(error);

  return (
    <div className={`ui-input-wrapper ${className}`.trim()}>
      {label ? (
        <label htmlFor={inputId} className="ui-input__label">
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        className={`ui-input ${hasError ? 'ui-input--error' : ''}`}
        aria-invalid={hasError}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        {...props}
      />
      {error ? (
        <span id={`${inputId}-error`} className="ui-input__error">
          {error}
        </span>
      ) : null}
      {helperText && !error ? (
        <span id={`${inputId}-helper`} className="ui-input__helper">
          {helperText}
        </span>
      ) : null}
    </div>
  );
}
