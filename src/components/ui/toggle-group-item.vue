<script setup lang="ts">
import { computed, inject, useAttrs, type PropType } from 'vue';
import { ToggleGroupItem } from 'reka-ui';
import { cn } from '@/lib/utils';
import { toggleVariants } from '@/lib/utils';

const props = defineProps({
  value: { type: String, required: true },
  variant: { type: String as PropType<"default" | "outline">, default: 'default' },
  size: { type: String as PropType<"default" | "sm" | "lg">, default: 'default' },
  class: { type: String, default: '' },
});

const context = inject('toggleGroup', { variant: 'default', size: 'default' });

const computedClass = computed(() =>
  cn(
    toggleVariants({
      variant: context.variant || props.variant,
      size: context.size || props.size,
    }),
    props.class
  )
);

const attrs = useAttrs();
</script>

<template>
  <ToggleGroupItem :value="props.value" :class="computedClass" v-bind="attrs">
    <slot />
  </ToggleGroupItem>
</template>
