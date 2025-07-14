<script setup lang="ts">
import { computed, useAttrs, type PropType } from 'vue';
import { DropdownMenuContent as DropdownMenuContentRadix } from 'reka-ui';
import { cn } from '@/lib/utils';
import DropdownMenuPortal from './dropdown-menu-portal.vue';

const props = defineProps({
  class: { type: String, default: '' },
  align: { type: String as PropType<"center" | "start" | "end">, default: 'center' },
  sideOffset: { type: Number, default: 4 },
});

const computedClass = computed(() =>
  cn(
    "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
    "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
    props.class
  )
);

const attrs = useAttrs();
</script>

<template>
  <DropdownMenuPortal>
    <DropdownMenuContentRadix :side-offset="props.sideOffset" :align="props.align" :class="computedClass" v-bind="attrs">
      <slot />
    </DropdownMenuContentRadix>
  </DropdownMenuPortal>
</template>
