<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { cn } from '@/lib/utils';

const props = defineProps({
  class: {
    type: String,
    default: '',
  },
});

const computedClass = computed(() =>
  cn("mb-1 font-medium leading-none tracking-tight", props.class)
);

const attrs = useAttrs();
</script>

<template>
  <h5 :class="computedClass" v-bind="attrs">
    <slot />
  </h5>
</template>
