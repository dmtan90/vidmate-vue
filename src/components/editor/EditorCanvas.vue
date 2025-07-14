<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useEditorStore } from '@/store/editor';
import EditorActivityIndicator from './EditorActivityIndicator.vue';
import { cn } from '@/lib/utils';
import { useCanvasStore } from '@/store/canvas';
import { fabric } from 'fabric';
import { storeToRefs } from "pinia";

const props = defineProps({
  page: {
    type: Number,
    required: true,
  },
});

const editor = useEditorStore();
const canvasStore = useCanvasStore();
const refCanvas = ref(null);
const { page } = storeToRefs(editor);

// const { initializeCanvas } = canvasStore.initializeCanvas(props.page);
onMounted(() => {
  // const canvas = document.getElementById('canvas-' + props.page);
  if(refCanvas.value){
    canvasStore.initializeCanvas(refCanvas.value, props.page);  
  }
});

watch(page, (value) => {
  console.log("page", value);
});

</script>

<template>
  <div :class="cn('absolute', page !== props.page ? 'opacity-0 z-0' : 'opacity-100 z-10')">
    <canvas ref="refCanvas" :id="`canvas-${props.page}`" />
    <EditorActivityIndicator :pending="editor.pages[props.page]?.template?.pending" />
  </div>
</template>