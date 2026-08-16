import { ThemeColor } from '../types';

export const getThemeBgClass = (color: ThemeColor) => {
  switch (color) {
    case 'red': return 'bg-red-600';
    case 'green': return 'bg-green-600';
    case 'purple': return 'bg-purple-600';
    case 'orange': return 'bg-orange-600';
    case 'blue': 
    default: return 'bg-blue-600';
  }
};

export const getThemeTextClass = (color: ThemeColor) => {
  switch (color) {
    case 'red': return 'text-red-600 dark:text-red-400';
    case 'green': return 'text-green-600 dark:text-green-400';
    case 'purple': return 'text-purple-600 dark:text-purple-400';
    case 'orange': return 'text-orange-600 dark:text-orange-400';
    case 'blue': 
    default: return 'text-blue-600 dark:text-blue-400';
  }
};

export const getThemeRingClass = (color: ThemeColor) => {
  switch (color) {
    case 'red': return 'focus:ring-red-500 dark:focus:ring-red-400';
    case 'green': return 'focus:ring-green-500 dark:focus:ring-green-400';
    case 'purple': return 'focus:ring-purple-500 dark:focus:ring-purple-400';
    case 'orange': return 'focus:ring-orange-500 dark:focus:ring-orange-400';
    case 'blue': 
    default: return 'focus:ring-blue-500 dark:focus:ring-blue-400';
  }
};

export const getThemeBorderClass = (color: ThemeColor) => {
  switch (color) {
    case 'red': return 'border-red-600';
    case 'green': return 'border-green-600';
    case 'purple': return 'border-purple-600';
    case 'orange': return 'border-orange-600';
    case 'blue': 
    default: return 'border-blue-600';
  }
};
