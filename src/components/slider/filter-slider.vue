<script setup lang="ts">
import { computed, useAttrs, type PropType } from 'vue';
import { SliderRoot, SliderTrack, SliderRange, SliderThumb } from 'reka-ui';
import { cn } from '@/lib/utils';

const props = defineProps({
  modelValue: { type: Array as PropType<number[]>, default: () => [0] },
  class: { type: String, default: '' },
});

const computedClass = computed(() =>
  cn("relative flex w-full touch-none select-none items-center", props.class)
);

const attrs = useAttrs();
</script>

<template>
  <SliderRoot :class="computedClass" :value="props.modelValue" v-bind="attrs">
    <SliderTrack class="relative h-6 w-full grow overflow-hidden rounded-sm bg-primary/20">
      <SliderRange class="absolute h-full bg-primary" />
    </SliderTrack>
    <SliderThumb class="block h-6 w-1 rounded-sm border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
    <span class="text-xxs font-medium text-primary-foreground absolute top-1/2 left-1.5 -translate-y-1/2 mt-px">{{ props.modelValue[0] || 0 }}</span>
  </SliderRoot>
</template>
