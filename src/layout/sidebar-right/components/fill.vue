<script setup lang="ts">
import { computed, ref, watch, reactive } from 'vue';
import { Eye, EyeOff, Pipette, X } from 'lucide-vue-next';
import { toast } from 'vue-sonner';
import { ChromePicker, ColorResult, tinycolor } from 'vue-color';

import Button from '@/components/ui/button.vue';
import TabsRoot from '@/components/ui/tabs-root.vue';
import TabsList from '@/components/ui/tabs-list.vue';
import TabsTrigger from '@/components/ui/tabs-trigger.vue';
import GradientSlider from '@/components/slider/gradient.vue';

import { darkHexCodes, lightHexCodes, pastelHexCodes } from '@/constants/editor';

import { useEditorStore } from '@/store/editor';
import { useCanvasStore } from '@/store/canvas';
import { storeToRefs } from "pinia";
import { defaultFill, defaultGradient } from '@/fabric/constants';
import { cn, createInstance } from '@/lib/utils';
import { useMeasure } from '@/hooks/use-measure';
import { FabricUtils } from '@/fabric/utils';

const editor = useEditorStore();
const canvasStore = useCanvasStore();
const { canvas, selectionActive: selected } = storeToRefs(canvasStore);
// const canvas = editor.canvas;
// const selected = ref(canvas.selection?.active ?? null);
watch(canvas, (value) => {
  console.log("canvas", value);
  forceUpdate();
});

const [containerRef, measure] = useMeasure();

const index = ref(0);

const eyeDropperStatus = window.EyeDropper ? true : false;

const picker = {
  default: {
    picker: {
      boxShadow: "none",
      padding: 0,
      width: "100%",
      background: "transparent",
      borderRadius: 0,
    },
  },
};

const DEFAULT_COLOR = 'F5F7FA';
const DEFAULT_COLOR_DARK = '#004035';

// const tinyColor = defineModel('tinyColor', {
//   default: tinycolor(DEFAULT_COLOR)
// });

const computeColor = computed(() => {
  console.log("color", selected);
  if (!selected.value?.fill) return defaultFill;
  if (typeof selected.value.fill === "string") return selected.value.fill;
  return (selected.value.fill as fabric.Gradient).colorStops![index.value].color;
});

const mode = computed(() => {
  console.log("mode", selected);
  if (!selected.value?.fill || typeof selected.value.fill === "string") return "solid";
  return "gradient";
});

const colors = computed(() => {
  console.log("colors", selected);
  if (!selected.value || !selected.value.fill || typeof selected.value.fill === "string") return [];
  return (selected.value.fill as fabric.Gradient).colorStops!;
});

const coords = computed(() => {
  console.log("coords", selected);
  if (!selected.value || !selected.value.fill || typeof selected.value.fill === "string") return { x1: 0, y1: 0, x2: 0, y2: 0 };
  return (selected.value.fill as fabric.Gradient).coords!;
});

const forceUpdate = () => {
  // selected.value = canvas.selection?.active ?? null
  computeColor; mode; colors; coords;
};

const color = ref(computeColor.value);
// const mode = ref(computeMode.value);
// const colors = ref(computeColors.value);
// const coords = ref(computeCoords.value);

const onToggleFill = () => {
  if (selected.value?.fill) {
    canvas.value.onChangeActiveObjectProperty("previousFill", mode.value === "solid" ? selected.value.fill : selected.value.previousFill);
    canvas.value.onChangeActiveObjectProperty("fill", "");
  } else {
    const fill = !selected.value?.previousFill || typeof selected.value.previousFill !== "string" ? defaultFill : selected.value.previousFill;
    canvas.value.onChangeActiveObjectProperty("fill", fill);
  }
};

const onChangeColor = (result: tinycolor) => {
  // console.log("onChangeColor", result);
  const { _r, _g, _b, _a } = result;
  const color = fabric.Color.fromRgba(`rgba(${_r},${_g},${_b},${_a || 1})`);
  const hex = color.toHexa();

  switch (mode.value) {
    case "solid": {
      canvas.value.onChangeActiveObjectProperty("fill", `#${hex}`);
      break;
    }
    case "gradient": {
      const fill = selected.value?.fill as fabric.Gradient;
      const stops = JSON.parse(JSON.stringify(fill.colorStops)); // Deep copy
      stops[index.value].color = `#${hex}`;
      canvas.value.onChangeActiveObjectFillGradient(fill.type!, stops!, fill.coords!);
      break;
    }
  }
};

// watch(color, () => {
//   onChangeColor(tinycolor(color.value));
// });

// watch(selected, () => {
//   color.value = computeColor.value;
//   mode.value = computeMode.value;
//   colors.value = computeColors.value;
//   coords.value = computeCoords.value;
// });

const onSelectColorFromSwatch = (selectedColor: string) => {
  switch (mode.value) {
    case "solid": {
      canvas.value.onChangeActiveObjectProperty("fill", selectedColor);
      break;
    }
    case "gradient": {
      const fill = selected.value?.fill as fabric.Gradient;
      const stops = JSON.parse(JSON.stringify(fill.colorStops)); // Deep copy
      stops[index.value].color = selectedColor;
      canvas.value.onChangeActiveObjectFillGradient(fill.type!, stops!, fill.coords!);
      break;
    }
  }
};

const onChangeOffset = (idx: number, offsetValue: number) => {
  const fill = selected.value?.fill as fabric.Gradient;
  const stops = JSON.parse(JSON.stringify(fill.colorStops)); // Deep copy
  stops[idx].offset = offsetValue;
  canvas.value.onChangeActiveObjectFillGradient(fill.type!, stops, fill.coords!);
};

const onRotateGradient = (angle: number) => {
  const fill = selected.value?.fill as fabric.Gradient;
  canvas.value.onChangeActiveObjectFillGradient(fill.type!, fill.colorStops!, FabricUtils.convertGradient(angle));
};

const onChangeMode = (value: string) => {
  if (value === mode.value) return;
  switch (value) {
    case "solid": {
      const fill = !selected.value?.previousFill || typeof selected.value.previousFill !== "string" ? defaultFill : selected.value.previousFill;
      const previousFill = selected.value?.fill;
      canvas.value.onChangeActiveObjectProperty("fill", fill);
      canvas.value.onChangeActiveObjectProperty("previousFill", previousFill);
      break;
    }
    case "gradient": {
      const fill = !selected.value?.previousFill || typeof selected.value.previousFill === "string" ? defaultGradient : selected.value.previousFill;
      const previousFill = selected.value?.fill;
      canvas.value.onChangeActiveObjectFillGradient(fill.type, fill.colorStops, fill.coords);
      canvas.value.onChangeActiveObjectProperty("previousFill", previousFill);
      break;
    }
  }
};

const onOpenEyeDropper = async () => {
  if (!eyeDropperStatus) return;
  const eyeDropper = createInstance(window.EyeDropper);
  try {
    const result = await eyeDropper.open();
    onSelectColorFromSwatch(result.sRGBHex);
  } catch {
    toast.error("Failed to pick color from page");
  }
};

const disabled = computed(() => !selected.value || !selected.value.fill);

</script>

<template>
  <div class="h-full w-full">
    <div class="flex items-center h-14 border-b px-4 gap-2.5">
      <h2 class="font-semibold">Fill</h2>
      <Button size="icon" variant="ghost" class="ml-auto h-7 w-7" @click="onToggleFill">
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
    <section :class="cn('sidebar-container', !disabled ? 'opacity-100 pointer-events-auto' : 'opacity-50 pointer-events-none')">
      <div class="px-4 py-5">
        <TabsRoot v-model="mode" @update:model-value="(mode) => onChangeMode(mode)">
          <TabsList class="w-full grid grid-cols-2">
            <TabsTrigger value="solid" class="text-xs h-full gap-1">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="8" cy="8" r="4" fill="currentColor" fill-opacity="0.9" />
                <circle opacity="0.75" cx="8" cy="8" r="5.5" stroke="currentColor" stroke-opacity="0.9" />
              </svg>
              <span>Solid</span>
            </TabsTrigger>
            <TabsTrigger value="gradient" class="text-xs h-full gap-1">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="8" cy="8" r="4" fill="url(#fill-gradient)" fill-opacity="0.9" />
                <circle opacity="0.75" cx="8" cy="8" r="5.5" stroke="currentColor" stroke-opacity="0.9" />
                <defs>
                  <linearGradient id="fill-gradient" x1="8" y1="4" x2="8" y2="12" gradientUnits="userSpaceOnUse">
                    <stop stop-color="currentColor" />
                    <stop offset="1" stop-color="currentColor" stop-opacity="0" />
                  </linearGradient>
                </defs>
              </svg>
              <span>Gradient</span>
            </TabsTrigger>
          </TabsList>
        </TabsRoot>
      </div>
      <div class="px-4 flex flex-col divide-y">
        <div class="pb-4 flex flex-col gap-4">
          <div v-if="mode === 'gradient'" ref="containerRef">
            <GradientSlider :width="measure.width" :colors="colors" :coords="coords" :selected="index" @select="index = $event" @change="onChangeOffset" @rotate="onRotateGradient" />
          </div>
          <Button v-if="eyeDropperStatus" size="sm" variant="outline" class="gap-2 justify-between w-full shadow-none text-foreground/80" @click="onOpenEyeDropper">
            <span>Pick color from page</span>
            <Pipette class="h-3.5 w-3.5" />
          </Button>
          <ChromePicker v-model="color" @update:model-value="(color) => onChangeColor(tinycolor(color))" :styles="{}" />
        </div>
        <template v-if="editor.mode === 'creator' || !editor.adapter.brand">
          <!-- Render nothing -->
        </template>
        <template v-else>
          <div class="flex flex-col gap-4 py-5">
            <h4 class="text-xs font-semibold line-clamp-1">Brand Kit</h4>
            <div class="grid grid-cols-8 gap-2.5">
              <button v-for="code in editor.adapter.brand.primary_colors.concat(editor.adapter.brand.secondary_colors)" :key="code" @click="onSelectColorFromSwatch(code)" class="w-full aspect-square rounded border border-gray-400 transition-transform hover:scale-110" :style="{ backgroundColor: code }" />
            </div>
          </div>
        </template>
        <div class="flex flex-col gap-4 py-5">
          <h4 class="text-xs font-semibold line-clamp-1">Light Colors</h4>
          <div class="grid grid-cols-8 gap-2.5">
            <button v-for="code in lightHexCodes" :key="code" @click="onSelectColorFromSwatch(code)" class="w-full aspect-square rounded border border-gray-400 transition-transform hover:scale-110" :style="{ backgroundColor: code }" />
          </div>
        </div>
        <div class="flex flex-col gap-4 py-5">
          <h4 class="text-xs font-semibold line-clamp-1">Dark Colors</h4>
          <div class="grid grid-cols-8 gap-2.5">
            <button v-for="code in darkHexCodes" :key="code" @click="onSelectColorFromSwatch(code)" class="w-full aspect-square rounded border border-gray-400 transition-transform hover:scale-110" :style="{ backgroundColor: code }" />
          </div>
        </div>
        <div class="flex flex-col gap-4 py-5">
          <h4 class="text-xs font-semibold line-clamp-1">Pastel Colors</h4>
          <div class="grid grid-cols-8 gap-2.5">
            <button v-for="code in pastelHexCodes" :key="code" @click="onSelectColorFromSwatch(code)" class="w-full aspect-square rounded border border-gray-400 transition-transform hover:scale-110" :style="{ backgroundColor: code }" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>