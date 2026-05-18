import * as React from 'react'
import { cn } from '@/utils/cn'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline'
}

const variantStyles: Record<string, React.CSSProperties> = {
  default: {
    backgroundColor: 'var(--accent-primary)',
    color: '#ffffff',
  },
  secondary: {
    backgroundColor: 'var(--bg-hover)',
    color: 'var(--text-secondary)',
  },
  success: {
    backgroundColor: 'var(--success)',
    color: '#ffffff',
  },
  warning: {
    backgroundColor: 'var(--warning)',
    color: '#000000',
  },
  danger: {
    backgroundColor: 'var(--error)',
    color: '#ffffff',
  },
  outline: {
    backgroundColor: 'transparent',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border-color)',
  },
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
        className
      )}
      style={{
        ...variantStyles[variant],
        ...(variant === 'outline' ? { border: '1px solid var(--border-color)' } : {}),
      }}
      {...props}
    />
  )
}

export { Badge }
