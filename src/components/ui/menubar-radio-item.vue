<script setup lang="ts">
import { computed, useAttrs, type PropType } from 'vue';
import { MenubarRadioItem, MenubarItemIndicator } from 'reka-ui';
import { Dot } from 'lucide-vue-next';
import { cn } from '@/lib/utils';

const props = defineProps({
  class: { type: String, default: '' },
  value: { type: String, required: true },
});

const computedClass = computed(() =>
  cn(
    "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    props.class
  )
);

const attrs = useAttrs();
</script>

<template>
  <MenubarRadioItem :class="computedClass" :value="props.value" v-bind="attrs">
    <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarItemIndicator>
        <Dot class="h-4 w-4 fill-current" />
      </MenubarItemIndicator>
    </span>
    <slot />
  </MenubarRadioItem>
</template>
