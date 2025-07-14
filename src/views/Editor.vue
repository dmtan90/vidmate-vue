<template>
  <template v-if="status === 'pending' || status === 'uninitialized'">
    <section class="h-[100dvh] grid place-items-center">
      <div class="flex flex-col gap-2">
        <Spinner size="md" />
        <span class="text-sm font-medium">Initializing editor</span>
      </div>
    </section>
  </template>
  <template v-else-if="status === 'complete'">
    <section class="h-[100dvh] overflow-hidden flex flex-col select-none relative">
      <EditorMenubar />
      <main class="flex-1 flex w-full">
        <EditorSidebarLeft />
        <section class="flex-1 flex flex-col relative w-0 pb-16 sm:pb-0">
          <EditorToolbar />
          <div class="flex-1 relative" id="workspace">
            <template v-for="(page, index) in pages" :key="page.id + index" >
              <EditorCanvas :page="index" />
            </template>
            <EditorControls />
            <EditorFAB />
            <EditorRecorder />
            <Toaster rich-colors :position="position" :offset="24" :visible-toasts="6" />
          </div>
          <EditorFooter />
        </section>
        <EditorSidebarRight />
      </main>
      <AIPromptModal />
      <EditorPreviewModal />
    </section>
  </template>
  <template v-else-if="status === 'error'">
    <section class="h-[100dvh] grid place-items-center">
      <span class="text-sm font-medium text-destructive">Your browser doesn't support the editor</span>
    </section>
  </template>
</template>

<script setup lang="ts">
import { computed, watch, ref } from 'vue';
import { useEditorStore } from '@/store/editor';
import { useCanvasStore } from '@/store/canvas';
import { useIsTablet } from '@/hooks/use-media-query';
import { useInitializeEditor } from '@/hooks/use-initialize';
import { storeToRefs } from "pinia"

import EditorFAB from '@/layout/fab/EditorFAB.vue';
import EditorFooter from '@/layout/footer/EditorFooter.vue';
import EditorMenubar from '@/layout/menubar/EditorMenubar.vue';
import EditorToolbar from '@/layout/toolbar/EditorToolbar.vue';

import EditorSidebarLeft from '@/layout/sidebar-left/EditorSidebarLeft.vue';
import EditorSidebarRight from '@/layout/sidebar-right/EditorSidebarRight.vue';
import EditorPreviewModal from '@/layout/modals/preview/EditorPreviewModal.vue';
import AIPromptModal from '@/layout/modals/prompter/AIPromptModal.vue';

import Toaster from '@/components/ui/sonner.vue';
import EditorCanvas from '@/components/editor/EditorCanvas.vue';
import EditorRecorder from '@/components/editor/EditorRecorder.vue';
import EditorControls from '@/layout/controls/EditorControls.vue';
import Spinner from '@/components/ui/spinner.vue';
// import TooltipProvider from '@/components/ui/tooltip';

const editor = useEditorStore();
const canvasStore = useCanvasStore();
canvasStore.registerEvents();
const { status, pages } = storeToRefs(editor);
const isTablet = useIsTablet();
useInitializeEditor();
// const position = ref("bottom-right");

const position = computed(() => (isTablet ? 'bottom-right' : 'top-center'));
// const editorStatus = computed(() => status);

// watch(status, (value) => {
//   console.log("editorStatus", value);
// });

// watch(pages, (value) => {
//   console.log("pages", value);
// });
</script>
