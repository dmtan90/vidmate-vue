<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { ContextMenuItem } from 'reka-ui';
import { cn } from '@/lib/utils';

const props = defineProps({
  inset: { type: Boolean, default: false },
  class: { type: String, default: '' },
});

const computedClass = computed(() =>
  cn(
    "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    props.inset && "pl-8",
    props.class
  )
);

const attrs = useAttrs();
</script>

<template>
  <ContextMenuItem :class="computedClass" v-bind="attrs">
    <slot />
  </ContextMenuItem>
</template>
