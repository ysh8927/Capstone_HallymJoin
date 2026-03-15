import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCount(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace('.0', '') + 'k';
  return String(n);
}

export function categoryColor(cat: string): string {
  const map: Record<string, string> = {
    academic:    'bg-indigo-50 text-indigo-600',
    hobby:       'bg-pink-50 text-pink-600',
    performance: 'bg-purple-50 text-purple-600',
    sports:      'bg-orange-50 text-orange-600',
    volunteer:   'bg-green-50 text-green-600',
    religion:    'bg-amber-50 text-amber-600',
    etc:         'bg-gray-100 text-gray-500',
  };
  return map[cat] ?? map.etc;
}
