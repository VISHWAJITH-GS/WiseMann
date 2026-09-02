import type { ReactNode } from 'react';
import { Button as ShadcnButton } from '../ui/button';
import { Card as ShadcnCard } from '../ui/card';
import { Badge as ShadcnBadge } from '../ui/badge';
import { Input as ShadcnInput } from '../ui/input';
import { cn } from '../../lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className, onClick }: CardProps) {
  return (
    <ShadcnCard
      onClick={onClick}
      className={cn(
        'h-full min-h-0 p-4 shadow-sm transition-all duration-200 motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md sm:p-6',
        onClick && 'cursor-pointer active:scale-[0.99]',
        className
      )}
    >
      {children}
    </ShadcnCard>
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
  const variantMap = {
    primary: 'default',
    secondary: 'outline',
    danger: 'destructive',
    success: 'success',
  } as const;

  const sizeMap = {
    sm: 'sm',
    md: 'default',
    lg: 'lg',
  } as const;

  return (
    <ShadcnButton
      type={type}
      variant={variantMap[variant]}
      size={sizeMap[size]}
      disabled={disabled || loading}
      onClick={onClick}
      className={cn('min-h-10 gap-2 active:scale-[0.98] motion-safe:hover:-translate-y-px', className)}
    >
      {loading && <span className="animate-spin text-base">⏳</span>}
      {children}
    </ShadcnButton>
  );
}

interface BadgeProps {
  children: ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'ai';
  className?: string;
}

export function Badge({ children, variant = 'info', className }: BadgeProps) {
  const variantMap = {
    success: 'success',
    warning: 'warning',
    danger: 'destructive',
    info: 'info',
    ai: 'secondary',
  } as const;

  return (
    <ShadcnBadge variant={variantMap[variant]} className={className}>
      {children}
    </ShadcnBadge>
  );
}

interface RiskBadgeProps {
  risk: 'high' | 'medium' | 'low' | 'healthy';
  className?: string;
}

export function RiskBadge({ risk, className }: RiskBadgeProps) {
  const variantMap = {
    high: 'destructive',
    medium: 'warning',
    low: 'info',
    healthy: 'success',
  } as const;

  const labels = {
    high: 'High Risk',
    medium: 'Medium Risk',
    low: 'Low Risk',
    healthy: 'Healthy',
  };

  return (
    <ShadcnBadge variant={variantMap[risk]} className={cn('rounded-md px-2.5 py-1 text-xs', className)}>
      {labels[risk]}
    </ShadcnBadge>
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
    <Card className={cn('flex flex-col justify-between', className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="mb-3 text-sm font-medium text-slate-500">{label}</p>
          <div className="flex items-end flex-wrap gap-2">
            <span className="text-4xl font-black leading-none tracking-[-0.04em] text-slate-900">
              {value}
            </span>
            {unit && <span className="pb-1 text-sm text-slate-500">{unit}</span>}
          </div>
        </div>
        {icon && <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">{icon}</div>}
      </div>

      {trend && (
        <p
          className={cn(
            'mt-4 text-xs font-medium',
            trend.direction === 'up' ? 'text-emerald-600' : 'text-red-600'
          )}
        >
          {trend.direction === 'up' ? '↑' : '↓'} {Math.abs(trend.value)}%
        </p>
      )}
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
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full border-collapse bg-white">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-sm font-semibold text-slate-900"
                style={{ width: col.width }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className={cn('hover:bg-slate-50 transition-colors', rowClassName)}>
              {columns.map((col) => (
                <td key={`${idx}-${col.key}`} className="px-4 py-3 text-sm text-slate-700">
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
      {label && <label className="text-sm font-medium text-slate-900">{label}</label>}
      <div className="relative">
        <ShadcnInput
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onKeyPress={onKeyPress}
          disabled={disabled}
          className={cn(error ? 'border-red-500 focus-visible:ring-red-500' : '', icon && 'pr-9', className)}
        />
        {icon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
            {icon}
          </div>
        )}
      </div>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
