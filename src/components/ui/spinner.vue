<template>
  <div :class="spinnerClasses">
    <!-- Basic spinner SVG or CSS animation -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-loader-2 animate-spin"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  size: {
    type: String,
    default: 'md',
  },
});

const spinnerClasses = computed(() => {
  let sizeClass = '';
  switch (props.size) {
    case 'sm':
      sizeClass = 'w-4 h-4';
      break;
    case 'md':
      sizeClass = 'w-6 h-6';
      break;
    case 'lg':
      sizeClass = 'w-8 h-8';
      break;
    default:
      sizeClass = 'w-6 h-6';
  }
  return `text-primary ${sizeClass}`;
});
</script>

<style scoped>
/* Add any specific spinner styles here if needed */
</style>
