<script setup lang="ts">
import { computed, useAttrs, type PropType } from 'vue';
import { Toggle as ToggleRoot } from 'reka-ui';
import { cn } from '@/lib/utils';
import { toggleVariants } from '@/lib/utils';

const props = defineProps({
  variant: { type: String as PropType<"default" | "outline">, default: 'default' },
  size: { type: String as PropType<"default" | "sm" | "lg">, default: 'default' },
  class: { type: String, default: '' },
});

const computedClass = computed(() =>
  cn(toggleVariants({ variant: props.variant, size: props.size }), props.class)
);

const attrs = useAttrs();
</script>

<template>
  <ToggleRoot :class="computedClass" v-bind="attrs">
    <slot />
  </ToggleRoot>
</template>
