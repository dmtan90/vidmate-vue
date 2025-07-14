<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { TabsTrigger } from 'reka-ui';
import { cn } from '@/lib/utils';

const props = defineProps({
  class: { type: String, default: '' },
  value: { type: String, required: true },
  disabled: { type: Boolean, default: false },
});

const computedClass = computed(() =>
  cn(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow",
    props.class
  )
);

const attrs = useAttrs();
</script>

<template>
  <TabsTrigger :class="computedClass" :value="props.value" :disabled="props.disabled" v-bind="attrs">
    <slot />
  </TabsTrigger>
</template>