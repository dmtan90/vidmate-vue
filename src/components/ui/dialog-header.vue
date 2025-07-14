<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { cn } from '@/lib/utils';

const props = defineProps({
  class: { type: String, default: '' },
});

const computedClass = computed(() =>
  cn(
    "flex flex-col space-y-1.5 text-center sm:text-left",
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
