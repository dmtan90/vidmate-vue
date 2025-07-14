<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import Dialog from './dialog-root.vue';
import DialogContent from './dialog-content.vue';
import Command from './command.vue';

const props = defineProps({
  open: { type: Boolean, default: false },
});

const attrs = useAttrs();
</script>

<template>
  <Dialog :open="props.open" v-bind="attrs">
    <DialogContent class="overflow-hidden p-0">
      <Command class="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
        <slot />
      </Command>
    </DialogContent>
  </Dialog>
</template>
