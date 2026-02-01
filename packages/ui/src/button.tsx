import type { ReactNode, ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export function Button({
  children,
  className = "",
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = "ui-button";
  const variantStyles = `ui-button--${variant}`;
  const sizeStyles = `ui-button--${size}`;
  const loadingStyles = isLoading ? "ui-button--loading" : "";

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${loadingStyles} ${className}`.trim()}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <span className="ui-button__spinner" /> : null}
      {children}
    </button>
  );
}
