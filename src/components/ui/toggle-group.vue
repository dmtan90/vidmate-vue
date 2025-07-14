<script setup lang="ts">
import { computed, provide, useAttrs, type PropType } from 'vue';
import { ToggleGroupRoot } from 'reka-ui';
import { cn } from '@/lib/utils';
import { toggleVariants } from '@/lib/toggle-variants';

const props = defineProps({
  type: { type: String as PropType<"single" | "multiple">, default: 'single' },
  variant: { type: String, default: 'default' },
  size: { type: String, default: 'default' },
  class: { type: String, default: '' },
});

const computedClass = computed(() =>
  cn("flex items-center justify-center gap-1", props.class)
);

provide('toggleGroup', {
  variant: props.variant,
  size: props.size,
});

const attrs = useAttrs();
</script>

<template>
  <ToggleGroupRoot :type="props.type" :class="computedClass" v-bind="attrs">
    <slot />
  </ToggleGroupRoot>
</template>
