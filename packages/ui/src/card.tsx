import type { ReactNode, HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  footer?: ReactNode;
  variant?: 'default' | 'outlined' | 'elevated';
}

export function Card({
  children,
  title,
  subtitle,
  footer,
  variant = 'default',
  className = '',
  ...props
}: CardProps) {
  return (
    <div className={`ui-card ui-card--${variant} ${className}`.trim()} {...props}>
      {(title || subtitle) ? (
        <div className="ui-card__header">
          {title ? <h3 className="ui-card__title">{title}</h3> : null}
          {subtitle ? <p className="ui-card__subtitle">{subtitle}</p> : null}
        </div>
      ) : null}
      <div className="ui-card__body">{children}</div>
      {footer ? <div className="ui-card__footer">{footer}</div> : null}
    </div>
  );
}
