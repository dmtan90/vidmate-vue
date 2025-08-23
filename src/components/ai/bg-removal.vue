<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch, type PropType } from 'vue';
import { AutoWidth as ChevronsLeftRight } from '@icon-park/vue-next';
import { toast } from 'vue-sonner';
import VueDraggable from 'vue-draggable-resizable';

// import Button from '@/components/ui/button.vue';
import Spinner from '@/components/ui/spinner.vue';

import { rmbgAI, WEBGPU_MODEL_ID } from '@/models/rmbgAI';
// import { useEditorStore } from '@/store/editor';
import { useCanvasStore } from '@/store/canvas';
import { cn } from '@/lib/utils';
import { storeToRefs } from "pinia";
import { type AISelectPluginProps } from "@/layout/sidebar-right/components/ai.vue";

// Placeholder for AISelectPluginProps
// interface AISelectPluginProps {}

// Placeholder for fabric.Image type
// interface FabricImage {
//   src: string;
//   name: string;
//   scaleX?: number;
//   scaleY?: number;
//   cropX?: number;
//   cropY?: number;
//   angle?: number;
//   height?: number;
//   width?: number;
//   top?: number;
//   left?: number;
// }

// const props = defineProps<AISelectPluginProps>();

// const editor = useEditorStore();
// const canvas = useCanvasStore();
const { selectionActive: selected, canvas, replacer, instance } = storeToRefs(useCanvasStore());
// const rmbgAI = useRmbgAIStore();

const position = ref(0);
const refContainer = ref<HTMLElement | null>(null);
const dimensions = ref({ width: 0, height: 0 });
const entry = ref(null);
const pending = ref(null);

const updateEntry = () => {
  entry.value = rmbgAI.cache.get(selected.value?.name || '');
  pending.value = rmbgAI.pending.get(selected.value?.name || '');
};

const loading = ref(false);

// Custom useMeasure equivalent
const updateDimensions = () => {
  if (refContainer.value) {
    dimensions.value = { 
      width: refContainer.value.offsetWidth,
      height: refContainer.value.offsetHeight
    };
  }
};

onMounted(() => {
  updateEntry();
  updateDimensions();
  window.addEventListener('resize', updateDimensions);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateDimensions);
});

watch(() => dimensions.value.width, (newWidth) => {
  position.value = newWidth / 2;
});

const handleRemoveBackground = async () => {
  try {
    updateDimensions();
    loading.value = true;
    const original = entry.value ? entry.value.original : selected.value.src;
    if(!rmbgAI.getModelInfo().isLoaded){
      toast.info("Loading Background Remove Model");
      await rmbgAI.initializeModel(WEBGPU_MODEL_ID);
    }
    const blob = await rmbgAI.removeBackground(original, selected.value.name);
    if(!blob){
      toast.error("Unable to remove background from image");
      return;
    }
    const modified = URL.createObjectURL(blob);
    entry.value ? rmbgAI.updateCacheEntry(selected.value.name, { modified }) : rmbgAI.addCacheEntry(selected.value.name, original, modified, "original");
    updateEntry();
  } catch (error) {
    toast.error("Unable to remove background from image: " + error);
    console.error(error);
  } finally {
    loading.value = false
  }
};

const handleAdd = () => {
  if (!entry.value) return;
  const { scaleX, scaleY, cropX, cropY, angle, height, width, top = 0, left = 0 } = selected.value;
  canvas.value?.onAddImageFromSource(entry.value.modified, { top: top + 50, left: left + 50, scaleX, scaleY, cropX, cropY, angle, height, width }, true);
  toast.success("The modified image has been added to your artboard");
  updateEntry();
};

const handleReplaceOriginal = () => {
  if (!entry.value) return;
  replacer.value?.mark(instance.value?.getActiveObject());
  replacer.value.replace(entry.value.modified).then(() => {
    rmbgAI.updateCacheEntry(selected.value.name, { usage: "modified" });
    toast.success("The selected image has been replaced");
    updateEntry();
  });
};

const handleRestoreOriginal = () => {
  if (!entry.value) return;
  replacer.value?.mark(instance.value?.getActiveObject());
  replacer.value.replace(entry.value.original).then(() => {
    rmbgAI.updateCacheEntry(selected.value.name, { usage: "original" });
    toast.success("The selected image has been restored");
    updateEntry();
  });
};

const onDrag = (x: number, y: number) => {
  // console.log("onDrag", x);
  if(x < 0){
    return false;
  }
  else if(x > dimensions.value.width){
    return false;
  }
  position.value = x;
};

</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="w-full relative h-full" ref="refContainer" v-loading="loading">
      <template v-if="entry">
        <div class="bg-transparent-pattern">
          <img :src="entry.modified" class="w-full h-auto" />
        </div>
        <div class="bg-transparent-pattern absolute inset-0 overflow-hidden" :style="{ width: position + 'px', height: dimensions.height + 'px' }">
          <img :src="entry.original" class="w-full h-full object-cover object-left-top" />
        </div>
        <VueDraggable
          axis="x"
          :w="10"
          :h="dimensions.height"
          :x="position"
          :y="0"
          :min-width="10"
          :min-height="dimensions.height"
          :max-width="10"
          :max-height="dimensions.height"
          :draggable="true"
          :resizable="false"
          :onDrag="onDrag"
          class="!bg-transparent !border-none absolute top-0"
        >
          <div class="h-full w-0.5 bg-primary rounded-xl absolute top-0 grid place-items-center cursor-ew-resize">
            <div class="absolute h-6 w-6 rounded-full bg-primary grid place-items-center text-primary-foreground">
              <ChevronsLeftRight :size="14" />
            </div>
          </div>
        </VueDraggable>
      </template>
      <template v-else>
        <div class="bg-transparent-pattern">
          <img :src="selected.src" class="w-full h-auto" />
        </div>
      </template>
    </div>
    <template v-if="!entry">
      <div class="flex">
        <el-button class="w-full gap-2.5" type="primary" text bg round :disabled="pending" @click="handleRemoveBackground">
          <Spinner v-if="pending" class="h-4 w-4" />
          <span>Remove Background</span>
        </el-button>
      </div>
    </template>
    <template v-else>
      <el-space direction="vertical" fill>
        <el-button class="w-full" type="success" text bg round @click="handleAdd">
          Add as New Image
        </el-button>
        <template v-if="entry.usage === 'original'">
          <el-button class="w-full" type="danger" text bg round @click="handleReplaceOriginal">
            Replace Original Image
          </el-button>
        </template>
        <template v-else>
          <el-button class="w-full" type="primary" text bg round @click="handleRestoreOriginal">
            Restore Original Image
          </el-button>
        </template>
      </el-space>
    </template>
  </div>
</template>

<style>
.bg-transparent-pattern {

}
</style>