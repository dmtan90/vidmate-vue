<script setup lang="ts">
import { computed, useAttrs, type PropType } from 'vue';
import { MenubarContent as MenubarContentRadix } from 'reka-ui';
import { cn } from '@/lib/utils';
import MenubarPortal from './menubar-portal.vue';

const props = defineProps({
  class: { type: String, default: '' },
  align: { type: String as PropType<"start" | "center" | "end">, default: 'start' },
  alignOffset: { type: Number, default: -4 },
  sideOffset: { type: Number, default: 8 },
});

const computedClass = computed(() =>
  cn(
    "z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
    props.class
  )
);

const attrs = useAttrs();
</script>

<template>
  <MenubarPortal>
    <MenubarContentRadix :align="props.align" :align-offset="props.alignOffset" :side-offset="props.sideOffset" :class="computedClass" v-bind="attrs">
      <slot />
    </MenubarContentRadix>
  </MenubarPortal>
</template>
