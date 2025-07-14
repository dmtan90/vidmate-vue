<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { DrawerContent as DrawerContentVaul } from 'vaul-vue';
import { cn } from '@/lib/utils';
import DrawerPortal from './drawer-portal.vue';
import DrawerOverlay from './drawer-overlay.vue';

const props = defineProps({
  class: { type: String, default: '' },
});

const computedClass = computed(() =>
  cn(
    "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-xl border bg-card",
    props.class
  )
);

const attrs = useAttrs();
</script>

<template>
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerContentVaul :class="computedClass" v-bind="attrs">
      <div class="mx-auto mt-4 h-1 w-10 rounded-full bg-gray-300" />
      <slot />
    </DrawerContentVaul>
  </DrawerPortal>
</template>
