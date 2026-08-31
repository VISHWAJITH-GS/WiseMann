import { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'card bg-white border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className,
  onClick,
  type = 'button',
}: ButtonProps) {
  const baseStyles =
    'font-medium rounded-lg transition-all duration-200 inline-flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-black text-white hover:bg-ink focus:ring-2 focus:ring-offset-2 focus:ring-black',
    secondary: 'bg-white text-text border border-border hover:bg-surface focus:ring-2 focus:ring-offset-2 focus:ring-black',
    danger: 'bg-danger text-white hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-danger',
    success: 'bg-success text-white hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-success',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
    >
      {loading && <span className="animate-spin">⏳</span>}
      {children}
    </button>
  );
}

interface BadgeProps {
  children: ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'ai';
  className?: string;
}

export function Badge({ children, variant = 'info', className }: BadgeProps) {
  const variants = {
    success: 'badge badge-success bg-success-soft text-success',
    warning: 'badge badge-warning bg-warning-soft text-warning',
    danger: 'badge badge-danger bg-danger-soft text-danger',
    info: 'badge badge-info bg-info-soft text-info',
    ai: 'badge badge-ai bg-ai-soft text-ai-primary',
  };

  return (
    <span className={clsx('inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold', variants[variant], className)}>
      {children}
    </span>
  );
}

interface RiskBadgeProps {
  risk: 'high' | 'medium' | 'low' | 'healthy';
  className?: string;
}

export function RiskBadge({ risk, className }: RiskBadgeProps) {
  const variants = {
    high: 'bg-danger-soft text-danger',
    medium: 'bg-warning-soft text-warning',
    low: 'bg-info-soft text-info',
    healthy: 'bg-success-soft text-success',
  };

  const labels = {
    high: 'High Risk',
    medium: 'Medium Risk',
    low: 'Low Risk',
    healthy: 'Healthy',
  };

  return (
    <span className={clsx('inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-semibold', variants[risk], className)}>
      {labels[risk]}
    </span>
  );
}

interface KPICardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: ReactNode;
  trend?: { value: number; direction: 'up' | 'down' };
  className?: string;
}

export function KPICard({ label, value, unit, icon, trend, className }: KPICardProps) {
  return (
    <Card className={className}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-text-secondary text-sm mb-2">{label}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-ink">{value}</span>
            {unit && <span className="text-text-muted text-sm">{unit}</span>}
          </div>
          {trend && (
            <p
              className={clsx(
                'text-xs mt-2',
                trend.direction === 'up' ? 'text-success' : 'text-danger'
              )}
            >
              {trend.direction === 'up' ? '↑' : '↓'} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        {icon && <div className="text-text-muted">{icon}</div>}
      </div>
    </Card>
  );
}

interface DataTableProps {
  columns: Array<{ key: string; label: string; width?: string }>;
  data: Array<Record<string, ReactNode>>;
  rowClassName?: string;
}

export function DataTable({ columns, data, rowClassName }: DataTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="data-table w-full">
        <thead className="bg-surface border-b border-border">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-sm font-semibold text-text"
                style={{ width: col.width }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className={clsx('hover:bg-surface transition-colors', rowClassName)}>
              {columns.map((col) => (
                <td key={`${idx}-${col.key}`} className="px-4 py-3 text-sm text-text">
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  type?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  icon?: ReactNode;
}

export function Input({
  label,
  placeholder,
  value,
  onChange,
  onKeyPress,
  type = 'text',
  error,
  disabled,
  className,
  icon,
}: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-sm font-medium text-text">{label}</label>}
      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onKeyPress={onKeyPress}
          disabled={disabled}
          className={clsx(
            'rounded-lg border px-3 py-2 text-text focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all w-full',
            error ? 'border-danger' : 'border-border',
            disabled && 'bg-surface opacity-50 cursor-not-allowed',
            icon && 'pr-9',
            className
          )}
        />
        {icon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
            {icon}
          </div>
        )}
      </div>
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  );
}
