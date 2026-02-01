import type { ReactNode, HTMLAttributes } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}: BadgeProps) {
  return (
    <span
      className={`ui-badge ui-badge--${variant} ui-badge--${size} ${className}`.trim()}
      {...props}
    >
      {children}
    </span>
  );
}

export interface StatusBadgeProps extends Omit<BadgeProps, 'variant'> {
  status: 'OPEN' | 'IN_PROGRESS' | 'PENDING';
}

export function StatusBadge({ status, ...props }: StatusBadgeProps) {
  const variantMap: Record<StatusBadgeProps['status'], BadgeProps['variant']> = {
    OPEN: 'info',
    IN_PROGRESS: 'warning',
    PENDING: 'success',
  };

  const labelMap: Record<StatusBadgeProps['status'], string> = {
    OPEN: 'Open',
    IN_PROGRESS: 'In Progress',
    PENDING: 'Pending',
  };

  return (
    <Badge variant={variantMap[status]} {...props}>
      {labelMap[status]}
    </Badge>
  );
}
