<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { ContextMenuSeparator } from 'reka-ui';
import { cn } from '@/lib/utils';

const props = defineProps({
  class: { type: String, default: '' },
});

const computedClass = computed(() =>
  cn("-mx-1 my-1 h-px bg-border", props.class)
);

const attrs = useAttrs();
</script>

<template>
  <ContextMenuSeparator :class="computedClass" v-bind="attrs">
    <slot />
  </ContextMenuSeparator>
</template>
