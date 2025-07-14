<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { AlertDialogAction } from 'reka-ui';
import { cn, buttonVariants } from '@/lib/utils';

const props = defineProps({
  class: { type: String, default: '' },
});

const computedClass = computed(() =>
  cn(buttonVariants({ variant: 'default' }), props.class)
);

const attrs = useAttrs();
</script>

<template>
  <AlertDialogAction :class="computedClass" v-bind="attrs">
    <slot />
  </AlertDialogAction>
</template>
