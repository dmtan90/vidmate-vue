<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { TooltipContent as TooltipContentRadix, TooltipPortal } from 'reka-ui';
import { cn } from '@/lib/utils';

const props = defineProps({
  class: { type: String, default: '' },
  sideOffset: { type: Number, default: 4 },
});

const computedClass = computed(() =>
  cn(
    "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
    props.class
  )
);

const attrs = useAttrs();
</script>

<template>
  <TooltipPortal>
    <TooltipContentRadix :side-offset="props.sideOffset" :class="computedClass" v-bind="attrs">
      <slot />
    </TooltipContentRadix>
  </TooltipPortal>
</template>
