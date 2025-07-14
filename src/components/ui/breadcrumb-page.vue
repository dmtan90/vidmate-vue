<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { cn } from '@/lib/utils';

const props = defineProps({
  class: { type: String, default: '' },
});

const computedClass = computed(() =>
  cn("font-normal text-foreground", props.class)
);

const attrs = useAttrs();
</script>

<template>
  <span role="link" aria-disabled="true" aria-current="page" :class="computedClass" v-bind="attrs">
    <slot />
  </span>
</template>
