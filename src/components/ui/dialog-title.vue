<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { DialogTitle as DialogTitleRadix } from 'reka-ui';
import { cn } from '@/lib/utils';

const props = defineProps({
  class: { type: String, default: '' },
});

const computedClass = computed(() =>
  cn(
    "text-lg font-semibold leading-none tracking-tight",
    props.class
  )
);

const attrs = useAttrs();
</script>

<template>
  <DialogTitleRadix :class="computedClass" v-bind="attrs">
    <slot />
  </DialogTitleRadix>
</template>
