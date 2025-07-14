<script setup lang="ts">
import { computed } from 'vue';
// import { DialogRoot, DialogPortal, DialogOverlay, DialogContent, DialogTitle, DialogDescription } from 'reka-ui';
import DialogRoot from '@/components/ui/dialog-root.vue';
import DialogPortal from '@/components/ui/dialog-portal.vue';
import DialogContent from '@/components/ui/dialog-content.vue';
import DialogOverlay from '@/components/ui/dialog-overlay.vue';
import DialogTitle from '@/components/ui/dialog-title.vue';
import DialogDescription from '@/components/ui/dialog-description.vue';

import { useEditorStore } from '@/store/editor';

const editor = useEditorStore();

const prompterModal = computed(() => editor.prompter.modal);

</script>

<template>
  <DialogRoot :open="prompterModal">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <DialogContent class="fixed left-1/2 top-1/2 z-50 grid w-full max-w-screen-lg -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
        <DialogTitle class="sr-only">Prompt Modal</DialogTitle>
        <DialogDescription class="sr-only">Generate video with the help of AI</DialogDescription>
        <!-- Content for the AI Prompt Modal will go here -->
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
