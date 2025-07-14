<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Eye, EyeOff, Pipette, X } from 'lucide-vue-next';
import { ChromePicker, ColorResult, tinycolor } from 'vue-color';
import { toast } from 'vue-sonner';

import Button from '@/components/ui/button.vue';
import { useEditorStore } from '@/store/editor';
import { useCanvasStore } from '@/store/canvas';
import { storeToRefs } from 'pinia';
import { cn, createInstance } from '@/lib/utils';
import { darkHexCodes, lightHexCodes, pastelHexCodes } from '@/constants/editor';

const editor = useEditorStore();
const canvasStore = useCanvasStore();
const { canvas, selectionActive: selected } = storeToRefs(canvasStore);

// const canvas = editor.canvas;
// const selected = ref(canvas.selection?.active ?? null);
const eyeDropperStatus = window.EyeDropper ? true : false;
const disabled = ref(!selected.value || !selected.value.stroke);
const color = ref(disabled.value ? "#ffffff" : selected.value?.stroke);

watch(selected, () => {
  // selected.value = canvas.selection?.active ?? null;
  disabled.value = !selected.value || !selected.value.stroke;
  color.value = disabled.value ? "#ffffff" : selected.value?.stroke;
});

const onChangeColor = (result: tinycolor) => {
  // console.log("onChangeColor", result);
  const { _r, _g, _b, _a } = result;
  const color = (window as any).fabric.Color.fromRgba(`rgba(${_r},${_g},${_b},${_a || 1})`);
  const hex = color.toHexa();
  canvas.value.onChangeActiveObjectProperty("stroke", `#${hex}`);
};

const onOpenEyeDropper = async () => {
  if (!eyeDropperStatus) return;
  const eyeDropper = createInstance(window.EyeDropper);
  try {
    const result = await eyeDropper.open();
    canvas.value.onChangeActiveObjectProperty("stroke", result.sRGBHex);
  } catch {
    toast.error("Failed to pick color from page");
  }
};

</script>

<template>
  <div class="h-full w-full">
    <div class="flex items-center h-14 border-b px-4 gap-2.5">
      <h2 class="font-semibold">Stroke</h2>
      <Button size="icon" variant="ghost" class="ml-auto h-7 w-7" @click="canvas.onChangeActiveObjectProperty('stroke', disabled ? '#000000' : '')">
        <template v-if="disabled">
          <EyeOff :size="15" :stroke-width="2" />
        </template>
        <template v-else>
          <Eye :size="15" :stroke-width="2" />
        </template>
      </Button>
      <Button size="icon" variant="outline" class="bg-card h-7 w-7" @click="editor.setActiveSidebarRight(null)">
        <X :size="15" />
      </Button>
    </div>
    <section class="sidebar-container">
      <div :class="cn('px-4 py-4 flex flex-col divide-y', !disabled ? 'opacity-100 pointer-events-auto' : 'opacity-50 pointer-events-none')">
        <div class="pb-4 flex flex-col gap-4">
          <Button v-if="eyeDropperStatus" size="sm" variant="outline" class="gap-2 justify-between w-full shadow-none text-foreground/80" @click="onOpenEyeDropper">
            <span>Pick color from page</span>
            <Pipette class="h-3.5 w-3.5" />
          </Button>
          <ChromePicker v-model="color" @update:model-value="(color) => onChangeColor(tinycolor(color))" :styles="{}" />
        </div>
        <div class="flex flex-col gap-4 py-5">
          <h4 class="text-xs font-semibold line-clamp-1">Light Colors</h4>
          <div class="grid grid-cols-8 gap-2.5">
            <button
              v-for="code in lightHexCodes"
              :key="code"
              @click="canvas.onChangeActiveObjectProperty('stroke', code)"
              class="w-full aspect-square rounded border border-gray-400 transition-transform hover:scale-110"
              :style="{ backgroundColor: code }"
            />
          </div>
        </div>
        <div class="flex flex-col gap-4 py-5">
          <h4 class="text-xs font-semibold line-clamp-1">Dark Colors</h4>
          <div class="grid grid-cols-8 gap-2.5">
            <button
              v-for="code in darkHexCodes"
              :key="code"
              @click="canvas.onChangeActiveObjectProperty('stroke', code)"
              class="w-full aspect-square rounded border border-gray-400 transition-transform hover:scale-110"
              :style="{ backgroundColor: code }"
            />
          </div>
        </div>
        <div class="flex flex-col gap-4 py-5">
          <h4 class="text-xs font-semibold line-clamp-1">Pastel Colors</h4>
          <div class="grid grid-cols-8 gap-2.5">
            <button
              v-for="code in pastelHexCodes"
              :key="code"
              @click="canvas.onChangeActiveObjectProperty('stroke', code)"
              class="w-full aspect-square rounded border border-gray-400 transition-transform hover:scale-110"
              :style="{ backgroundColor: code }"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>