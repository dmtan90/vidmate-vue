<template>
  <template v-if="status === 'pending' || status === 'uninitialized'">
    <section class="h-[100dvh] grid place-items-center">
      <div class="flex flex-col gap-2 items-center">
        <Spinner size="md" />
        <span class="text-sm font-medium">Initializing editor</span>
      </div>
    </section>
  </template>
  <template v-else-if="status === 'complete'">
    <section class="h-[100dvh] overflow-hidden flex flex-col select-none relative">
      <EditorMenubar />
      <main class="flex-1 flex w-full h-[calc(100dvh-56px)]">
        <EditorSidebarLeft class="h-[calc(100dvh-56px)]"/>
        <section class="flex-1 flex flex-col relative w-0 pb-16 sm:pb-0">
          <EditorToolbar v-if="active"/>
          <div class="flex-1 relative overflow-hidden" id="workspace">
            <template v-for="(page, index) in pages" :key="page.id" >
              <EditorCanvas :id="page.id" />
            </template>
            <EditorControls />
            <EditorRecorder />
            <Toaster rich-colors :position="position" :offset="24" :visible-toasts="6" />
          </div>
          <EditorFooter />
          <!--<AnimatePresence>
            <Motion
              :initial="{ opacity: 0 }" :animate="{ opacity: 1 }" :exit="{ opacity: 0 }"
              v-if="active">
              <EditorToolbar/>
            </Motion>
          </AnimatePresence>
          <div class="flex-1 relative overflow-hidden" id="workspace">
            <template v-for="(page, index) in pages" :key="page.id" >
              <EditorCanvas :id="page.id" />
            </template>
            <EditorControls />
            <EditorRecorder />
            <Toaster rich-colors :position="position" :offset="24" :visible-toasts="6" />
          </div>
          <AnimatePresence>
            <Motion layout :transition="{ default: { ease: 'spring' }, layout: { duration: 0.3 } }">
              <EditorFooter />
            </Motion>
          </AnimatePresence>-->
        </section>
        <!--<AnimatePresence>
          <Motion layout class="h-[calc(100dvh-56px)]" :style="{ width: sidebarRight ? '280px' : '0px' }" :transition="{ default: { ease: 'spring' }, layout: { duration: 0.3 } }">
            <EditorSidebarRight />
          </Motion>
        </AnimatePresence>-->
        <EditorSidebarRight class="h-[calc(100dvh-56px)]"/>
      </main>
      <AIPromptModal />
      <EditorPreviewModal />
    </section>
  </template>
  <template v-else>
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
import { Motion, AnimatePresence } from 'motion-v'

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

const editor = useEditorStore();
const { status, pages, timelineOpen, sidebarRight } = storeToRefs(editor);
const canvasStore = useCanvasStore();
canvasStore.registerEvents();
const { selectionActive: active } = storeToRefs(canvasStore);
const isTablet = useIsTablet();
useInitializeEditor();
const pageSize = computed(() => pages.value?.length || 0);
watch(pageSize, (value) => {
  console.log("pageSize", value)
})
// const position = ref("bottom-right");

const position = computed(() => (isTablet ? 'bottom-right' : 'top-center'));
// const editorStatus = computed(() => status);

// watch(active, (value) => {
//   console.log("editorStatus", value);
// });
// console.log("editor", editor);
// editor.$subscribe((mutation, state) => {
//   console.log("editor", mutation, state);
// })
// watch(editor, (value) => {
//   console.log("editor", value);
// }, { immediate: true });
</script>
