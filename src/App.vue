<script setup lang="ts">
import { provide } from 'vue';
import Editor from './views/Editor.vue';
import TooltipProvider from './components/ui/tooltip-provider.vue';
import { useThemeProvider, type ThemeProviderState } from './context/theme';

const themeProvider = useThemeProvider() as ThemeProviderState;
provide('theme', themeProvider);
</script>

<template>
  <TooltipProvider :delayDuration="300">
    <Editor />
  </TooltipProvider>
</template>
