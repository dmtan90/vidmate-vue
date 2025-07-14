<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { cn } from '@/lib/utils';

const props = defineProps({
  class: { type: String, default: '' },
});

const computedClass = computed(() =>
  cn("mt-auto flex flex-col gap-2 p-4", props.class)
);

const attrs = useAttrs();
</script>

<template>
  <div :class="computedClass" v-bind="attrs">
    <slot />
  </div>
</template>
