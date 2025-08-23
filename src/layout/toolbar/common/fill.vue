<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useEditorStore } from '@/store/editor';
import { useCanvasStore } from '@/store/canvas';
import { storeToRefs } from 'pinia';
import { cn } from '@/lib/utils';

const editor = useEditorStore();
const canvasStore = useCanvasStore();
const { canvas, selectionActive: selected } = storeToRefs(canvasStore);

const background = computed(() => {
  if (!selected.value) return "#000000";
  if (typeof selected.value.fill === "string") return selected.value.fill || "#000000";
  const gradient = (selected.value.fill as fabric.Gradient).colorStops!.map((stop) => `${stop.color} ${stop.offset * 100}%`).join(", ");
  return `linear-gradient(90deg, ${gradient})`;
});

</script>

<template>
  <div class="flex items-center gap-2.5">
    <el-button
      @click="editor.setActiveSidebarRight(editor.sidebarRight === 'fill' ? null : 'fill')"
      type="primary" text bg round
      :class="cn('gap-1.5 px-2.5', editor.sidebarRight === 'fill' ? 'bg-card' : '')"
    >
      <div class="relative">
        <div :class="cn('h-5 w-5 border rounded-full', !selected?.fill ? 'opacity-50' : 'opacity-100')" :style="{ background }" />
        <div v-if="!selected?.fill" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-6 bg-card-foreground -rotate-45" />
      </div>
      <span class="text-xs font-normal">Fill</span>
    </el-button>
  </div>
</template>