<script setup lang="ts">
import { computed, useAttrs, type PropType } from 'vue';
import { Separator } from 'reka-ui';
import { cn } from '@/lib/utils';

const props = defineProps({
  orientation: { type: String as PropType<"horizontal" | "vertical">, default: 'horizontal' },
  decorative: { type: Boolean, default: true },
  class: { type: String, default: '' },
});

const computedClass = computed(() =>
  cn(
    "shrink-0 bg-border",
    props.orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
    props.class
  )
);

const attrs = useAttrs();
</script>

<template>
  <Separator :decorative="props.decorative" :orientation="props.orientation" :class="computedClass" v-bind="attrs" />
</template>
