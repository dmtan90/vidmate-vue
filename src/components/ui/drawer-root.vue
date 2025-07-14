<script setup lang="ts">
import { DrawerRoot } from 'vaul-vue';

const props = defineProps({
  shouldScaleBackground: { type: Boolean, default: true },
});
</script>

<template>
  <DrawerRoot :should-scale-background="props.shouldScaleBackground">
    <slot />
  </DrawerRoot>
</template>
