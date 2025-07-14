<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { DropdownMenuLabel } from 'reka-ui';
import { cn } from '@/lib/utils';

const props = defineProps({
  inset: { type: Boolean, default: false },
  class: { type: String, default: '' },
});

const computedClass = computed(() =>
  cn(
    "px-2 py-1.5 text-sm font-semibold",
    props.inset && "pl-8",
    props.class
  )
);

const attrs = useAttrs();
</script>

<template>
  <DropdownMenuLabel :class="computedClass" v-bind="attrs">
    <slot />
  </DropdownMenuLabel>
</template>
