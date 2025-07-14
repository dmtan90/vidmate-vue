<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { cn } from '@/lib/utils';

const props = defineProps({
  asChild: { type: Boolean, default: false },
  class: { type: String, default: '' },
});

const computedClass = computed(() =>
  cn("transition-colors hover:text-foreground", props.class)
);

const attrs = useAttrs();
</script>

<template>
  <component :is="props.asChild ? 'div' : 'a'" :class="computedClass" v-bind="attrs">
    <slot />
  </component>
</template>
