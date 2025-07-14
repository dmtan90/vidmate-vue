<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { cn } from '@/lib/utils';

const props = defineProps({
  class: { type: String, default: '' },
});

const computedClass = computed(() =>
  cn(
    "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
    props.class
  )
);

const attrs = useAttrs();
</script>

<template>
  <div :class="computedClass" v-bind="attrs">
    <slot />
  </div>
</template>
