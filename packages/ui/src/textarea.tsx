import type { TextareaHTMLAttributes } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Textarea({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}: TextareaProps) {
  const textareaId = id || `textarea-${Math.random().toString(36).slice(2, 9)}`;
  const hasError = Boolean(error);

  return (
    <div className={`ui-textarea-wrapper ${className}`.trim()}>
      {label ? (
        <label htmlFor={textareaId} className="ui-textarea__label">
          {label}
        </label>
      ) : null}
      <textarea
        id={textareaId}
        className={`ui-textarea ${hasError ? 'ui-textarea--error' : ''}`}
        aria-invalid={hasError}
        aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
        {...props}
      />
      {error ? (
        <span id={`${textareaId}-error`} className="ui-textarea__error">
          {error}
        </span>
      ) : null}
      {helperText && !error ? (
        <span id={`${textareaId}-helper`} className="ui-textarea__helper">
          {helperText}
        </span>
      ) : null}
    </div>
  );
}
