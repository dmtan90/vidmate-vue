<script setup lang="ts">
import { MenubarRoot } from 'reka-ui';
import { cn } from '@/lib/utils';
import { computed, useAttrs } from 'vue';

const props = defineProps({
  class: { type: String, default: '' },
});

const computedClass = computed(() =>
  cn(
    "flex h-9 items-center space-x-1 rounded-md border bg-background p-1 shadow-sm",
    props.class
  )
);

const attrs = useAttrs();
</script>

<template>
  <MenubarRoot :class="computedClass" v-bind="attrs">
    <slot />
  </MenubarRoot>
</template>
