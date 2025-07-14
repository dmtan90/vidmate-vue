<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { AlertDialogCancel } from 'reka-ui';
import { cn, buttonVariants } from '@/lib/utils';

const props = defineProps({
  class: { type: String, default: '' },
});

const computedClass = computed(() =>
  cn(buttonVariants({ variant: 'outline' }), "mt-2 sm:mt-0", props.class)
);

const attrs = useAttrs();
</script>

<template>
  <AlertDialogCancel :class="computedClass" v-bind="attrs">
    <slot />
  </AlertDialogCancel>
</template>
