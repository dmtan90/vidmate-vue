<script setup lang="ts">
import { computed, useAttrs, type PropType } from 'vue';
import { PopoverContent as PopoverContentRadix, PopoverPortal } from 'reka-ui';
import { cn } from '@/lib/utils';

const props = defineProps({
  class: { type: String, default: '' },
  align: { type: String as PropType<"center" | "start" | "end">, default: 'center' },
  sideOffset: { type: Number, default: 4 },
});

const computedClass = computed(() =>
  cn(
    "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
    props.class
  )
);

const attrs = useAttrs();
</script>

<template>
  <PopoverPortal>
    <PopoverContentRadix :align="props.align" :side-offset="props.sideOffset" :class="computedClass" v-bind="attrs">
      <slot />
    </PopoverContentRadix>
  </PopoverPortal>
</template>