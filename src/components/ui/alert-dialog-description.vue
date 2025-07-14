<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { AlertDialogDescription } from 'reka-ui';
import { cn } from '@/lib/utils';

const props = defineProps({
  class: { type: String, default: '' },
});

const computedClass = computed(() =>
  cn("text-sm text-muted-foreground", props.class)
);

const attrs = useAttrs();
</script>

<template>
  <AlertDialogDescription :class="computedClass" v-bind="attrs">
    <slot />
  </AlertDialogDescription>
</template>
