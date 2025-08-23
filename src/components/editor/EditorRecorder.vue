<template>
  <div class="absolute opacity-100 z-1">
    <canvas ref="refCanvas" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useCanvasStore } from '@/store/canvas';

const canvasStore = useCanvasStore();
const refCanvas = ref(null);

onMounted(() => {
  if(refCanvas.value){
    canvasStore.initializeRecorder(refCanvas.value);  
  }
});
</script>

<style scoped>
/* Scoped styles for EditorRecorder */
</style>
