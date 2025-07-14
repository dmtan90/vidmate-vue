<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { Command as CommandPrimitive } from 'vue-command-palette';
import { cn } from '@/lib/utils';

const props = defineProps({
  class: { type: String, default: '' },
});

const computedClass = computed(() =>
  cn("max-h-[300px] overflow-y-auto overflow-x-hidden", props.class)
);

const attrs = useAttrs();
</script>

<template>
  <CommandPrimitive.List :class="computedClass" v-bind="attrs">
    <slot />
  </CommandPrimitive.List>
</template>
