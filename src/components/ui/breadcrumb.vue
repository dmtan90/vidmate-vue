<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { cn } from '@/lib/utils';

const props = defineProps({
  separator: { type: [String, Object], default: undefined },
  class: { type: String, default: '' },
});

const computedClass = computed(() => cn(props.class));
const attrs = useAttrs();
</script>

<template>
  <nav role="navigation" aria-label="breadcrumb" :class="computedClass" v-bind="attrs">
    <slot />
  </nav>
</template>