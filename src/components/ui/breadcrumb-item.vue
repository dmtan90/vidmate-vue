<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { cn } from '@/lib/utils';

const props = defineProps({
  class: { type: String, default: '' },
});

const computedClass = computed(() =>
  cn("inline-flex items-center gap-1.5", props.class)
);

const attrs = useAttrs();
</script>

<template>
  <li :class="computedClass" v-bind="attrs">
    <slot />
  </li>
</template>
