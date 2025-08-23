<script setup lang="ts">
import { computed, ref, watch, onUnmounted, reactive, onMounted } from 'vue';
import { Left as ChevronLeft, Right as ChevronRight, Minus, Music } from '@icon-park/vue-next';
import { debounce } from 'lodash';
import VueDraggable from 'vue-draggable-resizable'

import { ElButton } from 'element-plus';

import { useEditorStore } from '@/store/editor';
import { useCanvasStore } from '@/store/canvas';
import { storeToRefs } from 'pinia';
import { drawWaveformFromAudioBuffer } from '@/lib/media';
import { formatMediaDuration } from '@/lib/time';
import { cn } from '@/lib/utils';
import { FabricUtils } from '@/fabric/utils';
import { propertiesToInclude } from '@/fabric/constants';

import ElementDescription from './ElementDescription.vue';

const props = defineProps<{ element: fabric.Object | any; trackWidth: number; type: string }>();
// console.log("props", props);

const editor = useEditorStore();
const canvasStore = useCanvasStore();
const { canvas, selectionActive: active, selection, timeline, animations, trimmerActive, trimmer, audio, instance } = storeToRefs(canvasStore);
const handle = ref<NodeJS.Timeout | null>(null);
const backgroundURL = ref("");

const SEEK_TIME_WIDTH = 42;
const HANDLE_WIDTH = 16;
const HANDLE_HEIGHT = 40;

const offset = ref(0);
const duration = ref(0);
const width = ref(0);
const backgroundWidth = ref(0);
// const disabled = ref(false);
const disabled = computed(() => timeline.value?.playing || animations.value?.previewing);
// const style = reactive({
//   backgroundImage: `url(${backgroundURL.value})`,
//   backgroundSize: `${backgroundWidth.value}px 40px`,
// });
const style = computed(() => {
  return {
    backgroundImage: `url(${backgroundURL.value})`,
    backgroundSize: `${backgroundWidth.value}px 40px`,
  }
});
const isSelected = ref(false);
const trackWidth = ref(0);

const drawWaveformFromAudio = debounce((audio: any) => {
  drawWaveformFromAudioBuffer(audio.buffer, 40, width.value, audio.trim, audio.timeline).then((blob) => {
    backgroundURL.value = URL.createObjectURL(blob);
  });
}, 1000);

const drawElementAsBackground = debounce((element: fabric.Object) => {
  if (handle.value) clearTimeout(handle.value);
  const object = instance.value!.getItemByName(element.name);
  if (object) {
    object.clone((clone: fabric.Object) => {
      clone.set({ opacity: 1, visible: true, clipPath: undefined });
      if (FabricUtils.isVideoElement(clone)) (clone as any).seek(1);
      handle.value = setTimeout(() => {
        backgroundURL.value = clone.toDataURL({ format: "webp", withoutShadow: true, withoutTransform: true });
      }, 1000);
    }, propertiesToInclude);
  }
}, 1000);

const computeSelected = () => {
  let isActive = false;
  if (!active.value){
    isActive = false;
  }
  else{
    if (FabricUtils.isActiveSelection(active.value)){
      isActive = active.value?.objects?.some((object) => object.name === props.element.name)  
    }
    else {
      isActive = active.value?.name === props.element.name;
    };
  }
  isSelected.value = isActive;
};

const computeStyle = () => {
  offset.value = (props.element.meta!.offset / 1000) * SEEK_TIME_WIDTH;
  width.value = ((props.element.meta!.duration / 1000) * SEEK_TIME_WIDTH) ?? 10;
  // backgroundWidth.value = 40 * (props.element.width! / props.element.height!) + 10;
  backgroundWidth.value = 40 * (props.element.width! / props.element.height!);
  const durationInSeconds = timeline.value?.duration / 1000;
  trackWidth.value = durationInSeconds * SEEK_TIME_WIDTH;
};

const computeUpdate = () => {
  // console.log("computeUpdate", active);
  computeSelected();
  computeStyle();
};

const render = () => {
  const element = props.element;
  if(!element){
    return;
  }

  computeUpdate();
  if(element.type == "audio"){
    const _audio = audio.value?.get(element.name);
    console.log("render", _audio);
    if(_audio){
      drawWaveformFromAudio(_audio);  
    }
  }
  else{
    drawElementAsBackground(element);
  }
}

watch(() => props.element, (newElement) => {
  render();
}, { immediate: true });

watch([canvas, selection, active], (value) => {
  computeUpdate();
});

watch(isSelected, (newVal) => {
  if (trimmerActive.value?.object.id === props.element.id && !newVal) trimmer.value.exit();
});

onMounted(() => {
  render();
});

onUnmounted(() => {
  if(props.type == "audio"){
    URL.revokeObjectURL(backgroundURL.value);
    drawWaveformFromAudio.cancel();
  }
  else{
    drawElementAsBackground.cancel();
  }
});

const handleDragTrack = (x: number, y: number) => {
  if(y < 0){
    return false;
  }

  if (disabled.value || x < 0) return false;
  const newOffset = Math.floor((x / SEEK_TIME_WIDTH) * 1000);
  const object = instance.value!.getItemByName(props.element.name);
  if (object && newOffset + object.meta.duration <= timeline.value?.duration) {
    if(props.type == "audio"){
      audio.value?.update(props.element.name, { offset: newOffset/1000 });
    }
    else{
      canvas.value.onChangeObjectTimelineProperty(object, "offset", newOffset);  
    }
    return true;
  }
  return false;
};

const handleDragLeftBar = (value: number) => {
  if (disabled.value || value < 0) return false;
  const newOffset = Math.floor((value / SEEK_TIME_WIDTH) * 1000);
  const duration = props.element.meta!.duration + props.element.meta!.offset - newOffset;
  const object = instance.value!.getItemByName(props.element.name);
  if (object) {
    if(props.type == "audio"){
      audio.value?.update(object.name, { offset: newOffset/1000, timeline: duration/1000 });
    }
    else{
      canvas.value.onChangeObjectTimelineProperty(object, "offset", newOffset);
      canvas.value.onChangeObjectTimelineProperty(object, "duration", duration);  
    }
    return true;
  }
  return false;
};

const handleDragRightBar = (value: number) => {
  if (disabled.value) return false;
  const newDuration = Math.floor((value / SEEK_TIME_WIDTH) * 1000) - props.element.meta!.offset;
  const object = instance.value!.getItemByName(props.element.name);
  if (object && object.meta.offset + newDuration <= timeline.value?.duration) {
    if(props.type == "audio"){
      audio.value?.update(object.name, { timeline: newDuration/1000 });
    }
    else{
      canvas.value.onChangeObjectTimelineProperty(object, "duration", newDuration);  
    }
    return true;
  }
  return false;
};

const handleResizeTrack = (handle, x, y, width, height) => {
  if(handle == "ml"){
    return handleDragLeftBar(x);
  }
  else if(handle == "mr"){
    return handleDragRightBar(x + width);
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
        :onDrag="handleDragTrack"
        :onResize="handleResizeTrack"
        :handles="['ml', 'mr']"
        :active="isSelected"
        :preventDeactivation="true"
      >
        <template #ml>
          <button v-if="isSelected" class="flex items-center justify-center bg-primary absolute top-0 h-full z-10 rounded-l-lg cursor-ew-resize" :style="{ width: `${HANDLE_WIDTH}px` }">
            <Minus v-if="!Math.round(props.element.meta!.offset)" :size="15" class="text-white rotate-90" :stroke-width="2.5" />
            <ChevronLeft v-else :size="15" class="text-white" :stroke-width="2.5" />
          </button>
          <span v-else></span>
        </template>
        <button :class="cn('relative h-full w-full z-0 border-3 rounded-lg overflow-hidden cursor-grab active:cursor-grabbing', isSelected ? 'border-primary' : 'border-gray-400')" :style="style">
          <span :class="cn('absolute top-1 bg-foreground/50 text-card rounded-sm backdrop-blur-sm px-2 py-1 flex items-center gap-2.5 capitalize', isSelected ? 'left-5' : 'left-1')">
            <span class="text-xxs">{{ formatMediaDuration(props.element.meta!.duration) }}</span>
            <ElementDescription :name="props.element.name" :type="props.type" />
          </span>
        </button>
        <template #mr>
          <button v-if="isSelected" class="inline-flex items-center justify-center bg-primary absolute top-0 h-full z-10 rounded-r-lg cursor-ew-resize" :style="{ width: `${HANDLE_WIDTH}px`, right: '0px' }">
            <Minus v-if="props.element.meta!.duration + props.element.meta!.offset >= canvas.timeline.duration" :size="15" class="text-white rotate-90" :stroke-width="2.5" />
            <ChevronRight v-else :size="15" class="text-white" :stroke-width="2.5" />
          </button>
          <span v-else></span>
        </template>
      </VueDraggable>
    </div>
  </div>
</template>
