<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { ContextMenuSubTrigger } from 'reka-ui';
import { ChevronRight } from 'lucide-vue-next';
import { cn } from '@/lib/utils';

const props = defineProps({
  inset: { type: Boolean, default: false },
  class: { type: String, default: '' },
});

const computedClass = computed(() =>
  cn(
    "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
    props.inset && "pl-8",
    props.class
  )
);

const attrs = useAttrs();
</script>

<template>
  <ContextMenuSubTrigger :class="computedClass" v-bind="attrs">
    <slot />
    <ChevronRight class="ml-auto h-4 w-4" />
  </ContextMenuSubTrigger>
</template>
