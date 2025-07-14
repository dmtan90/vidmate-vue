<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { DrawerOverlay } from 'vaul-vue';
import { cn } from '@/lib/utils';

const props = defineProps({
  class: { type: String, default: '' },
});

const computedClass = computed(() =>
  cn("fixed inset-0 z-50 bg-black/80", props.class)
);

const attrs = useAttrs();
</script>

<template>
  <DrawerOverlay :class="computedClass" v-bind="attrs" />
</template>
