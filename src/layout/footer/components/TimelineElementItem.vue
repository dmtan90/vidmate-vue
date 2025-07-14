<script setup lang="ts">
import { computed, ref, watch, onUnmounted,reactive } from 'vue';
import { ChevronLeft, ChevronRight, Minus } from 'lucide-vue-next';
import { debounce } from 'lodash';
// import { VueDraggable } from 'vue-draggable-plus';
import VueDraggable from 'vue-draggable-resizable'

import { useEditorStore } from '@/store/editor';
import { useCanvasStore } from '@/store/canvas';
import { storeToRefs } from 'pinia';
import { formatMediaDuration } from '@/lib/time';
import { cn } from '@/lib/utils';
import { FabricUtils } from '@/fabric/utils';
import { propertiesToInclude } from '@/fabric/constants';

import ElementDescription from './ElementDescription.vue';

const props = defineProps<{ element: fabric.Object; trackWidth: number }>();

const editor = useEditorStore();
const canvasStore = useCanvasStore();
const { canvas, selection, selectionActive: active, timeline, animations, instance } = storeToRefs(canvasStore);

const handle = ref<NodeJS.Timeout | null>(null);
const backgroundURL = ref("");
// const canvas = editor.canvas;

const SEEK_TIME_WIDTH = 42;
const HANDLE_WIDTH = 16;
const HANDLE_HEIGHT = 40;

const offset = ref(0);
const width = ref(0);
const backgroundWidth = ref(0);
const disabled = ref(false);
const style = reactive({
  backgroundImage: `url(${backgroundURL.value})`,
  backgroundSize: `${backgroundWidth.value}px 40px`,
  // width: '100%',
  // height: '100%'
});
const isSelected = ref(false);
// const durationInSeconds = ref(0);//computed(() => canvas.timeline.duration / 1000);
const trackWidth = ref(0);//computed(() => durationInSeconds.value * SEEK_TIME_WIDTH);
// let offset = computed(() => (props.element.meta!.offset / 1000) * SEEK_TIME_WIDTH);
// let width = computed(() => (props.element.meta!.duration / 1000) * SEEK_TIME_WIDTH);
// let backgroundWidth = computed(() => 40 * (props.element.width! / props.element.height!) + 10);

// let disabled = computed(() => canvas.timeline.playing || canvas.animations.previewing);
// let style = computed(() => ({
//   width: `${width.value}px`,
//   backgroundImage: `url(${backgroundURL.value})`,
//   backgroundSize: `${backgroundWidth.value}px 40px`,
// }));

// let isSelected = computed(() => {
//   console.log("isSelected");
//   if (!canvas.selection?.active) return false;
//   if (FabricUtils.isActiveSelection(canvas.selection?.active)) return canvas.selection.active.objects.some((object) => object.name === props.element.name);
//   let active = canvas.selection.active.name === props.element.name;
//   console.log("isSelected", active);
//   return active;
// });

const drawElementAsBackground = debounce((element: fabric.Object) => {
  if (handle.value) clearTimeout(handle.value);
  const object = instance.value!.getItemByName(element.name);
  if (object) {
    object.clone((clone: fabric.Object) => {
      clone.set({ opacity: 1, visible: true, clipPath: undefined });
      if (FabricUtils.isVideoElement(clone)) (clone as any).seek(1);
      handle.value = setTimeout(() => {
        backgroundURL.value = clone.toDataURL({ format: "webp", withoutShadow: true, withoutTransform: true })
        style.backgroundImage = `url(${backgroundURL.value})`;
      }, 1000);
    }, propertiesToInclude);
  }
}, 1000);

const forceUpdate = () => {
  // console.log("isSelected");
  let isActive = false;
  if (!active.value){
    isActive = false;
  }
  else{
    if (FabricUtils.isActiveSelection(active.value)) return active.value?.objects.some((object) => object.name === props.element.name);
    isActive = active.value?.name === props.element.name;
  }
  // if (!canvas.selection?.active) return isSelected.value = false;
  // if (FabricUtils.isActiveSelection(canvas.selection?.active)) return canvas.selection.active.objects.some((object) => object.name === props.element.name);
  // let active = canvas.selection.active.name === props.element.name;
  // console.log("isSelected", active);
  isSelected.value = isActive;

  offset.value = (props.element.meta!.offset / 1000) * SEEK_TIME_WIDTH;
  width.value = (props.element.meta!.duration / 1000) * SEEK_TIME_WIDTH;
  backgroundWidth.value = 40 * (props.element.width! / props.element.height!) + 10;
  disabled.value = timeline.value?.playing || animations.value?.previewing;

  // style.width = `${width.value}px`;
  style.backgroundImage = `url(${backgroundURL.value})`;
  style.backgroundSize = `${backgroundWidth.value}px 40px`

  const durationInSeconds = timeline.value?.duration / 1000;
  trackWidth.value = durationInSeconds * SEEK_TIME_WIDTH;
  // style.value = {
  //   width: 
  //   backgroundImage: `url(${backgroundURL.value})`,
  //   backgroundSize: `${backgroundWidth.value}px 40px`,
  // };

  // console.log("forceUpdate", offset, width, backgroundWidth, disabled, style);
};

watch(() => props.element, (newElement) => {
  forceUpdate();
  drawElementAsBackground(newElement);
}, { immediate: true });

watch(canvas, (value) => {
  // console.log("canvas", value);
  forceUpdate();
});

onUnmounted(() => {
  drawElementAsBackground.cancel();
});

const handleDragTrack = (value: number) => {
  if (disabled.value) return;
  const newOffset = Math.floor((value / SEEK_TIME_WIDTH) * 1000);
  const object = instance.value!.getItemByName(props.element.name);
  if (object) {
    canvas.value.onChangeObjectTimelineProperty(object, "offset", newOffset);
  }
};

const handleDragLeftBar = (x: number) => {
  if (disabled.value) return;
  const newOffset = Math.floor((x / SEEK_TIME_WIDTH) * 1000);
  const duration = props.element.meta!.duration + props.element.meta!.offset - newOffset;
  const object = instance.value!.getItemByName(props.element.name);
  if (object) {
    // console.log("handleDragLeftBar", newOffset, duration);
    canvas.value.onChangeObjectTimelineProperty(object, "offset", newOffset);
    canvas.value.onChangeObjectTimelineProperty(object, "duration", duration);
  }
};

const handleDragRightBar = (width: number) => {
  if (disabled.value) return;
  const newDuration = Math.floor((width / SEEK_TIME_WIDTH) * 1000) - props.element.meta!.offset;
  const object = instance.value!.getItemByName(props.element.name);
  if (object) {
    // console.log("handleDragRightBar", newDuration);
    canvas.value.onChangeObjectTimelineProperty(object, "duration", newDuration);
  }
};

const handleResizeTrack = (handle, x, y, width, height) => {
  // console.log("handleResizeTrack", handle, x, y, width, height);
  if(handle == "ml"){
    handleDragLeftBar(x);
  }
  else if(handle == "mr"){
    handleDragRightBar(x + width);
  }
  else{
    return false;
  }
};

</script>

<template>
  <div class="h-10 overflow-visible shrink-0 relative">
    <div class="parent-draggable" :style="{ width: `${trackWidth}px`, height: `${HANDLE_HEIGHT}px`, position: 'relative' }">
      <VueDraggable
        axis="x"
        :x="offset"
        :y="0"
        :w="width"
        :h="HANDLE_HEIGHT"
        :parent="true"
        :onDrag="(x) => handleDragTrack(x)"
        :onResize="handleResizeTrack"
        :handles="['ml', 'mr']"
        @pointerdown="(event) => (disabled ? null : selection.selectObjectByName(props.element.name!, event.shiftKey))"
      >
        <template #ml>
          <button v-if="isSelected" class="flex items-center justify-center bg-primary absolute top-0 h-full z-10 rounded-l-lg cursor-ew-resize" :style="{ width: `${HANDLE_WIDTH}px` }">
            <Minus v-if="!Math.round(props.element.meta!.offset)" :size="15" class="text-white rotate-90" :stroke-width="2.5" />
            <ChevronLeft v-else :size="15" class="text-white" :stroke-width="2.5" />
          </button>
        </template>
        <button :class="cn('relative h-full w-full z-0 border-3 rounded-lg overflow-hidden cursor-grab active:cursor-grabbing', isSelected ? 'border-primary' : 'border-gray-400')" :style="style">
          <span :class="cn('absolute top-1 bg-foreground/50 text-card rounded-sm backdrop-blur-sm px-2 py-1 flex items-center gap-2.5 capitalize', isSelected ? 'left-5' : 'left-1')">
            <span class="text-xxs">{{ formatMediaDuration(props.element.meta!.duration) }}</span>
            <ElementDescription :name="props.element.name" :type="props.element.type" />
          </span>
        </button>
        <template #mr>
          <button v-if="isSelected" class="inline-flex items-center justify-center bg-primary absolute top-0 h-full z-10 rounded-r-lg cursor-ew-resize" :style="{ width: `${HANDLE_WIDTH}px`, right: '0px' }">
            <Minus v-if="props.element.meta!.duration + props.element.meta!.offset >= canvas.timeline.duration" :size="15" class="text-white rotate-90" :stroke-width="2.5" />
            <ChevronRight v-else :size="15" class="text-white" :stroke-width="2.5" />
          </button>
        </template>
      </VueDraggable>
    </div>
  </div>
</template>
