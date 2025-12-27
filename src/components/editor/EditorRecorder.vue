<template>
  <div :class="cn('absolute', editor?.instance?.preview ? 'opacity-100 z-100' : 'opacity-0 z-0')">
    <canvas ref="refCanvas" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useEditorStore } from '@/store/editor'
import { useCanvasStore } from '@/store/canvas';
import { cn } from '@/lib/utils';

const editor = useEditorStore();
const canvasStore = useCanvasStore();
const refCanvas = ref(null);

watch(refCanvas, (canvas) => {
  if(canvas){
    canvasStore.initializeRecorder(canvas);
  }
})

</script>

<style scoped>
/* Scoped styles for EditorRecorder */
</style>
