<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { cn } from '@/lib/utils';

const props = defineProps({
  class: { type: String, default: '' },
});

const computedClass = computed(() =>
  cn("animate-pulse rounded-md bg-black/10 dark:bg-white/10", props.class)
);

const attrs = useAttrs();
</script>

<template>
  <div :class="computedClass" v-bind="attrs" />
</template>
