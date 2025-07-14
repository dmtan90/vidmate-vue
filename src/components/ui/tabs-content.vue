<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { TabsContent } from 'reka-ui';
import { cn } from '@/lib/utils';

const props = defineProps({
  class: { type: String, default: '' },
  value: { type: String, required: true },
});

const computedClass = computed(() =>
  cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", props.class)
);

const attrs = useAttrs();
</script>

<template>
  <TabsContent :class="computedClass" :value="props.value" v-bind="attrs">
    <slot />
  </TabsContent>
</template>