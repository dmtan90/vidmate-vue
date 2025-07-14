<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { cn } from '@/lib/utils';
import { MoreHorizontal } from 'lucide-vue-next';

const props = defineProps({
  class: { type: String, default: '' },
});

const computedClass = computed(() =>
  cn("flex h-9 w-9 items-center justify-center", props.class)
);

const attrs = useAttrs();
</script>

<template>
  <span role="presentation" aria-hidden="true" :class="computedClass" v-bind="attrs">
    <MoreHorizontal class="h-4 w-4" />
    <span class="sr-only">More</span>
  </span>
</template>
