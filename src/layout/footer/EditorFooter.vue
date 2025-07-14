<script setup lang="ts">
import { computed } from 'vue';
import { useEditorStore } from '@/store/editor';
import { useIsTablet } from '@/hooks/use-media-query';

import EditorPlayback from './components/playback.vue';
import EditorTimeline from './components/timeline.vue';

const editor = useEditorStore();
const isTablet = useIsTablet();

const expanded = 288;
const collapsed = computed(() => (isTablet ? 64 : 56));

const footerHeight = computed(() =>
  editor.timelineOpen ? `${expanded}px` : `${collapsed.value}px`
);

</script>

<template>
  <footer
    v-if="editor.canvas.timeline"
    :style="{ height: footerHeight }"
    class="flex flex-col bg-card/75 sm:bg-card dark:bg-gray-900/40 sm:dark:bg-gray-900/30 border-t border-t-border/50 shrink-0 overflow-hidden"
  >
    <EditorPlayback />
    <EditorTimeline />
  </footer>
</template>
