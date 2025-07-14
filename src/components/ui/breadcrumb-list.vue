<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { cn } from '@/lib/utils';

const props = defineProps({
  class: { type: String, default: '' },
});

const computedClass = computed(() =>
  cn("flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5", props.class)
);

const attrs = useAttrs();
</script>

<template>
  <ol :class="computedClass" v-bind="attrs">
    <slot />
  </ol>
</template>
