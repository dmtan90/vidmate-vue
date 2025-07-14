<template>
  <TooltipProvider :delayDuration="delayDuration">
    <slot></slot>
  </TooltipProvider>
</template>

<script setup lang="ts">
import TooltipProvider from './tooltip.vue';

const props = defineProps({
  delayDuration: {
    type: Number,
    default: 300,
  },
});
</script>
