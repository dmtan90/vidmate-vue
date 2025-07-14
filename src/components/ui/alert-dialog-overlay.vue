<script setup lang="ts">
import { AlertDialogOverlay } from 'reka-ui';
import { cn } from '@/lib/utils';
import { computed } from 'vue';

const props = defineProps({
  class: { type: String, default: '' },
});

const computedClass = computed(() =>
  cn(
    "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
    props.class
  )
);
</script>

<template>
  <AlertDialogOverlay :class="computedClass" />
</template>
