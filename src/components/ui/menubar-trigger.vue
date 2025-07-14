<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { MenubarTrigger } from 'reka-ui';
import { cn } from '@/lib/utils';

const props = defineProps({
  class: { type: String, default: '' },
});

const computedClass = computed(() =>
  cn(
    "flex cursor-default select-none items-center rounded-sm px-3 py-1 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
    props.class
  )
);

const attrs = useAttrs();
</script>

<template>
  <MenubarTrigger :class="computedClass" v-bind="attrs">
    <slot />
  </MenubarTrigger>
</template>
