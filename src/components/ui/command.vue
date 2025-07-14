<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { Command as CommandPrimitive } from 'vue-command-palette';
import { cn } from '@/lib/utils';

const props = defineProps({
  class: { type: String, default: '' },
});

const computedClass = computed(() =>
  cn(
    "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
    props.class
  )
);

const attrs = useAttrs();
</script>

<template>
  <CommandPrimitive :class="computedClass" v-bind="attrs">
    <slot />
  </CommandPrimitive>
</template>
