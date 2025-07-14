<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { TabsList } from 'reka-ui';
import { cn } from '@/lib/utils';

const props = defineProps({
  class: { type: String, default: '' },
});

const computedClass = computed(() =>
  cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", props.class)
);

const attrs = useAttrs();
</script>

<template>
  <TabsList :class="computedClass" v-bind="attrs">
    <slot />
  </TabsList>
</template>
