import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const variantClass = {
  primary:   'bg-indigo-600 text-white hover:bg-indigo-700 border-transparent',
  secondary: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border-transparent',
  ghost:     'bg-transparent text-[var(--txt2)] hover:bg-[var(--bg2)] border-transparent',
  outline:   'bg-[var(--bg)] text-[var(--txt2)] hover:bg-[var(--bg2)] border-[var(--bdr)]',
};

const sizeClass = {
  sm: 'text-xs px-3 py-1.5 gap-1.5',
  md: 'text-sm px-4 py-2 gap-2',
  lg: 'text-sm px-5 py-2.5 gap-2',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'outline', size = 'md', className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-lg border',
        'transition-all duration-150 cursor-pointer select-none',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        variantClass[variant],
        sizeClass[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  ),
);
Button.displayName = 'Button';
export default Button;
