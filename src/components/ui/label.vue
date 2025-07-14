<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { Label } from 'reka-ui';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const props = defineProps({
  class: { type: String, default: '' },
});

const labelVariants = cva("text-sm font-medium text-gray-700 dark:text-gray-400 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");

const computedClass = computed(() =>
  cn(labelVariants(), props.class)
);

const attrs = useAttrs();
</script>

<template>
  <Label :class="computedClass" v-bind="attrs">
    <slot />
  </Label>
</template>