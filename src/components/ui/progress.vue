<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { ProgressRoot, ProgressIndicator } from 'reka-ui';
import { cn } from '@/lib/utils';

const props = defineProps({
  value: { type: Number, default: 0 },
  class: { type: String, default: '' },
});

const computedClass = computed(() =>
  cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", props.class)
);

const indicatorStyle = computed(() => ({
  transform: `translateX(-${100 - (props.value || 0)}%)`,
}));

const attrs = useAttrs();
</script>

<template>
  <ProgressRoot :class="computedClass" :value="props.value" v-bind="attrs">
    <ProgressIndicator class="h-full w-full flex-1 bg-primary transition-all" :style="indicatorStyle" />
  </ProgressRoot>
</template>
