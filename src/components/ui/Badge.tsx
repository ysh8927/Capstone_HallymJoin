import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'indigo' | 'teal' | 'amber' | 'rose' | 'purple' | 'green' | 'orange' | 'gray';
  size?: 'sm' | 'md';
  className?: string;
}

const variantClass = {
  default: 'bg-gray-100 text-gray-600',
  indigo:  'bg-indigo-50 text-indigo-600',
  teal:    'bg-teal-50 text-teal-600',
  amber:   'bg-amber-50 text-amber-600',
  rose:    'bg-rose-50 text-rose-500',
  purple:  'bg-purple-50 text-purple-600',
  green:   'bg-green-50 text-green-600',
  orange:  'bg-orange-50 text-orange-600',
  gray:    'bg-gray-100 text-gray-500',
};

export default function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1',
        variantClass[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
