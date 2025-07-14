<script setup lang="ts">
import { computed, useAttrs, ref, watch, type PropType } from 'vue';
import { SliderRoot, SliderTrack, SliderRange, SliderThumb } from 'reka-ui';
import { cn } from '@/lib/utils';

// const model = defineModel({ type: Array as PropType<number[]>, default: () => [0] })

const props = defineProps({
  value: { type: Array as PropType<number[]>, default: () => [0] },
  class: { type: String, default: '' },
});

const computedClass = computed(() =>
  cn("relative flex w-full touch-none select-none items-center data-[disabled]:pointer-events-none data-[disabled]:opacity-50", props.class)
);

const attrs = useAttrs();

const modelValue = ref(props.value);
watch(props, (value) => {
  // console.log("props", value);
  modelValue.value = props.value;
});
</script>

<template>
  <SliderRoot :class="computedClass" v-model="modelValue" v-bind="attrs">
    <SliderTrack class="relative h-1.5 w-full grow overflow-hidden rounded-full bg-black/20 dark:bg-white/20">
      <SliderRange class="absolute h-full bg-primary" />
    </SliderTrack>
    <SliderThumb class="block h-4 w-4 rounded-full border border-black/50 dark:border-white/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
  </SliderRoot>
</template>
