import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'success' | 'secondary' | 'ghost' | 'danger-ghost';
type Size = 'sm' | 'md' | 'icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas';

// Hover styles use the can-hover variant so touch devices never get stuck
// hover states; :active gives pressed feedback on touch.
const variants: Record<Variant, string> = {
  primary:
    'bg-accent text-accent-ink can-hover:hover:bg-accent-strong active:bg-accent-strong',
  // Transient copy-success state: restrained green, steady on hover/press.
  success: 'bg-success-strong text-success-ink active:bg-success-strong',
  secondary:
    'border border-line bg-raised text-ink can-hover:hover:border-line-strong can-hover:hover:bg-surface active:bg-surface',
  ghost:
    'text-muted can-hover:hover:bg-surface can-hover:hover:text-ink active:bg-surface active:text-ink',
  'danger-ghost':
    'text-danger can-hover:hover:bg-danger/10 active:bg-danger/15',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 min-h-[44px] px-5 text-sm',
  icon: 'h-11 min-h-[44px] w-11 min-w-[44px] p-0',
};

export function Button({ variant = 'secondary', size = 'md', className = '', children, ...rest }: ButtonProps) {
  return (
    <button
      className={`inline-flex select-none items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-150 motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-50 ${FOCUS} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
