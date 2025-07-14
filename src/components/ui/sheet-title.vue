<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { DialogTitle as SheetTitleRadix } from 'reka-ui';
import { cn } from '@/lib/utils';

const props = defineProps({
  class: { type: String, default: '' },
});

const computedClass = computed(() =>
  cn("text-lg font-semibold text-foreground", props.class)
);

const attrs = useAttrs();
</script>

<template>
  <SheetTitleRadix :class="computedClass" v-bind="attrs">
    <slot />
  </SheetTitleRadix>
</template>
