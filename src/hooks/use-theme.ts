import { inject } from 'vue';
import type { ThemeProviderState } from '@/context/theme';

export function useTheme() {
  const context = inject<ThemeProviderState>('theme');
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}