<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch, type PropType } from 'vue';
import { ChevronsLeftRight } from 'lucide-vue-next';
import { toast } from 'vue-sonner';
import VueDraggable from 'vue-draggable-resizable';

import Button from '@/components/ui/button.vue';
import Spinner from '@/components/ui/spinner.vue';

import { rmbgAI } from '@/models/rmbgAI';
import { useEditorStore } from '@/store/editor';
import { cn } from '@/lib/utils';

// Placeholder for AISelectPluginProps
interface AISelectPluginProps {}

// Placeholder for fabric.Image type
interface FabricImage {
  src: string;
  name: string;
  scaleX?: number;
  scaleY?: number;
  cropX?: number;
  cropY?: number;
  angle?: number;
  height?: number;
  width?: number;
  top?: number;
  left?: number;
}

const props = defineProps<AISelectPluginProps>();

const editor = useEditorStore();
// const rmbgAI = useRmbgAIStore();

const position = ref(0);
const refContainer = ref<HTMLElement | null>(null);
const dimensions = ref({ width: 0, height: 0 });

const selected = computed(() => editor.canvas.selection.active as FabricImage);
const entry = computed(() => rmbgAI.cache.get(selected.value?.name || ''));
const pending = computed(() => rmbgAI.pending.get(selected.value?.name || ''));

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
    const original = entry.value ? entry.value.original : selected.value.src;
    const blob = await rmbgAI.removeBackground(original, selected.value.name);
    const modified = URL.createObjectURL(blob);
    entry.value ? rmbgAI.updateCacheEntry(selected.value.name, { modified }) : rmbgAI.addCacheEntry(selected.value.name, original, modified, "original");
  } catch (error) {
    toast.error("Unable to remove background from image");
    console.warn(error);
  }
};

const handleAdd = () => {
  if (!entry.value) return;
  const { scaleX, scaleY, cropX, cropY, angle, height, width, top = 0, left = 0 } = selected.value;
  // Placeholder for editor.canvas.onAddImageFromSource
  console.log('Adding new image:', entry.value.modified);
  toast.success("The modified image has been added to your artboard");
};

const handleReplaceOriginal = () => {
  if (!entry.value) return;
  // Placeholder for editor.canvas.replacer.mark and replace
  console.log('Replacing original image with:', entry.value.modified);
  rmbgAI.updateCacheEntry(selected.value.name, { usage: "modified" });
  toast.success("The selected image has been replaced");
};

const handleRestoreOriginal = () => {
  if (!entry.value) return;
  // Placeholder for editor.canvas.replacer.mark and replace
  console.log('Restoring original image:', entry.value.original);
  rmbgAI.updateCacheEntry(selected.value.name, { usage: "original" });
  toast.success("The selected image has been restored");
};

const onDrag = (x: number) => {
  position.value = x;
};

</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="w-full h-auto relative" ref="refContainer">
      <template v-if="entry">
        <div class="bg-transparent-pattern">
          <img :src="entry.modified" class="w-full h-auto" />
        </div>
        <div class="bg-transparent-pattern absolute inset-0 overflow-hidden" :style="{ width: position + 'px' }">
          <img :src="entry.original" class="w-full h-full object-cover object-left-top" />
        </div>
        <VueDraggable
          :w="10"
          :h="dimensions.height"
          :x="position"
          :y="0"
          :min-width="0"
          :min-height="0"
          :max-width="dimensions.width"
          :max-height="dimensions.height"
          :draggable="true"
          :resizable="false"
          axis="x"
          @dragging="onDrag"
          :parent="true"
          class="!bg-transparent !border-none"
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
        <Button size="sm" class="w-full gap-2.5" variant="outline" :disabled="pending" @click="handleRemoveBackground">
          <Spinner v-if="pending" class="h-4 w-4" />
          <span>Remove Background</span>
        </Button>
      </div>
    </template>
    <template v-else>
      <div class="flex flex-col gap-2">
        <Button size="sm" class="w-full" @click="handleAdd">
          Add as New Image
        </Button>
        <template v-if="entry.usage === 'original'">
          <Button size="sm" class="w-full" variant="outline" @click="handleReplaceOriginal">
            Replace Original Image
          </Button>
        </template>
        <template v-else>
          <Button size="sm" class="w-full" variant="outline" @click="handleRestoreOriginal">
            Restore Original Image
          </Button>
        </template>
      </div>
    </template>
  </div>
</template>