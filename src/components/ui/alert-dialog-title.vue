<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { AlertDialogTitle } from 'reka-ui';
import { cn } from '@/lib/utils';

const props = defineProps({
  class: { type: String, default: '' },
});

const computedClass = computed(() =>
  cn("text-lg font-semibold", props.class)
);

const attrs = useAttrs();
</script>

<template>
  <AlertDialogTitle :class="computedClass" v-bind="attrs">
    <slot />
  </AlertDialogTitle>
</template>
