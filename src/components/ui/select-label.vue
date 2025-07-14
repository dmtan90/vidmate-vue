<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { SelectLabel as SelectLabelRadix } from 'reka-ui';
import { cn } from '@/lib/utils';

const props = defineProps({
  class: { type: String, default: '' },
});

const computedClass = computed(() =>
  cn("px-2 py-1.5 text-sm font-semibold", props.class)
);

const attrs = useAttrs();
</script>

<template>
  <SelectLabelRadix :class="computedClass" v-bind="attrs">
    <slot />
  </SelectLabelRadix>
</template>
