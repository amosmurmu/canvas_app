export type AppThemeMode = 'light' | 'dark';

/** Inline colors for React Flow / canvas elements that can't use Tailwind classes. */
export const flowColors = {
  light: {
    edge: '#4f46e5',
    dot: '#d4d4d8',
    minimapNode: '#a1a1aa',
    minimapMask: 'rgba(244, 244, 245, 0.75)',
  },
  dark: {
    edge: '#4f46e5',
    dot: '#2a2a35',
    minimapNode: '#3a3a48',
    minimapMask: 'rgba(15, 15, 17, 0.75)',
  },
} as const;

export function getFlowColors(theme: string | undefined): (typeof flowColors)[AppThemeMode] {
  return theme === 'light' ? flowColors.light : flowColors.dark;
}
