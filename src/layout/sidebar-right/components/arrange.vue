<script setup lang="ts">
import { computed, ref, watch, reactive } from 'vue';
import { Close as X, Aiming, Lock, Unlock, FlipHorizontally, FlipVertically } from '@icon-park/vue-next';
import { toast } from 'vue-sonner';
import Label from '@/components/ui/label.vue';
import Toggle from '@/components/ui/toggle.vue';
import SliderInput from '@/components/ui/SliderInput.vue';
import { move, align } from '@/constants/editor';

import { useEditorStore } from '@/store/editor';
import { useCanvasStore } from '@/store/canvas';
import { storeToRefs } from "pinia";
const editor = useEditorStore();
const canvasStore = useCanvasStore();
const { canvas, selectionActive: selected, alignment, timeline, audio } = storeToRefs(canvasStore);

watch(selected, (value) => {
  // console.log("selected", selected);
});

const width = computed({
  get(){
    return selected.value?.width!*selected.value?.scaleX!;
  },

  set(value){
    const type = selected.value?.type!;
    if(type == "image" || type == "video" || type == "gif"){
      let newWidth = value/selected.value?.scaleX!;
      let scaleX = newWidth * selected.value?.scaleX!/selected.value?.width!;
      canvas.value.onChangeActiveObjectProperty("scaleX", scaleX);
      canvas.value.onChangeActiveObjectProperty("scaleY", scaleX);
    }
    else{
      canvas.value.onChangeActiveObjectProperty("width", value);
    }
  }
});

const height = computed({
  get(){
    return selected.value?.height!*selected.value?.scaleY!;
  },

  set(value){
    const type = selected.value?.type!;
    if(type == "image" || type == "video" || type == "gif"){
      let newHeight = value/selected.value?.scaleY!;
      const scaleY = newHeight * selected.value?.scaleY / selected.value?.height;
      canvas.value.onChangeActiveObjectProperty("scaleX", scaleY);
      canvas.value.onChangeActiveObjectProperty("scaleY", scaleY);
    }
    else{
      canvas.value.onChangeActiveObjectProperty("height", value);  
    }
  }
});

const top = computed({
  get(){
    return selected.value?.top!;
  },

  set(value){
    canvas.value.onChangeActiveObjectProperty("top", value);
  }
});

const left = computed({
  get(){
    return selected.value?.left!;
  },

  set(value){
    canvas.value.onChangeActiveObjectProperty("left", value);
  }
});

const lockRatio = computed({
  get(){
    return selected.value?.keepRatio ?? false;
  },

  set(value){
    canvas.value.onChangeActiveObjectProperty("keepRatio", value);
    // canvas.value.onChangeActiveObjectProperty("lockScalingY", value);
  }
});

const rotate = computed({
  get(){
    return selected.value?.angle!;
  },

  set(value){
    canvas.value.onChangeActiveObjectProperty("angle", value);
  }
});

const disabledRatio = computed({
  get(){
    let disabled = false;
    let type = selected.value?.type!;
    if(type == "image" || type == "video" || type == "circle" || type == "textbox" || type == "path" || type == "line"){
      disabled = true;
    }
    return disabled;
  }
})

const flipX = computed({
  get(){
    return selected.value?.flipX!;
  },

  set(value){
    canvas.value.onChangeActiveObjectProperty("flipX", value);
  }
});

const flipY = computed({
  get(){
    return selected.value?.flipY!;
  },

  set(value){
    canvas.value.onChangeActiveObjectProperty("flipY", value);
  }
});

const onChangeAlign = (align) => {
  alignment.value?.alignActiveObjecToPage(align);
}

const onChangeOrder = (order) => {
  alignment.value?.changeActiveObjectLayer(order);
}

const offsetMs = computed(() => selected.value?.meta?.offset ?? selected.value.offset*1000 ?? 0);
const durationMs = computed(() => selected.value?.meta?.duration ?? selected.value.timeline*1000 ?? 0);
const durationInSecond = computed({
  get(){
    return durationMs.value! / 1000;
  },

  set(value){
    if(!selected.value?.type){
      audio.value.update(selected.value?.id, { duration: value });
    }
    else{
      canvas.value.onChangeActiveObjectTimelineProperty('duration', value * 1000);  
    }
  }
});

const offsetInSecond = computed({
  get(){
    return offsetMs.value! / 1000;
  },

  set(value){
    if(!selected.value?.type){
      audio.value.update(selected.value?.id, { offset: value });
    }
    else{
      canvas.value.onChangeActiveObjectTimelineProperty('offset', value * 1000);  
    }
  }
});

</script>

<template>
  <section class="sidebar-container flex flex-col h-full">
    <div class="relative overflow-x-scroll scrollbar-hidden">
      <div class="flex flex-col divide-y">
        <div class="flex flex-col gap-4 py-5">
          <h4 class="text-xs font-semibold line-clamp-1">Timeline</h4>
          <div class="grid grid-cols-1 gap-2.5">
            <div class="flex flex-col">
              <Label class="text-xs shrink-0">Duration (s)</Label>
              <SliderInput :model-value="durationInSecond" :min="1" :max="timeline.duration / 1000" :step="0.25" @update:model-value="(value) => durationInSecond = value"/>
            </div>
            <div class="flex flex-col">
              <Label class="text-xs shrink-0">Offset (s)</Label>
              <SliderInput :model-value="offsetInSecond" :min="0" :max="timeline.duration / 1000" :step="0.25" @update:model-value="(value) => offsetInSecond = value"/>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-4 py-5">
          <h4 class="text-xs font-semibold line-clamp-1">Order</h4>
          <div class="grid grid-cols-2 gap-2">
            <el-button text bg round class="w-full ml-0" v-for="item in move" :key="item.value" :icon="item.icon" @click="onChangeOrder(item.value)">
              <span>{{ item.label }}</span>
            </el-button>
          </div>
        </div>
        <div class="flex flex-col gap-4 py-5">
          <h4 class="text-xs font-semibold line-clamp-1">Align to page</h4>
          <div class="grid grid-cols-3 gap-2">
            <el-button text bg round class="w-full ml-0" v-for="item in align" :key="item.value" :icon="item.icon" @click="onChangeAlign(item.value)">
              <span>{{ item.label }}</span>
            </el-button>
          </div>
        </div>
        <div class="flex flex-col gap-4 py-5">
          <h4 class="text-xs font-semibold line-clamp-1">Flip</h4>
          <div class="grid grid-cols-2 gap-2">
            <el-button text bg round class="w-full ml-0" :icon="FlipHorizontally" @click="flipX = !flipX">
              <span>Horizontally</span>
            </el-button>
            <el-button text bg round class="w-full ml-0" :icon="FlipVertically" @click="flipY = !flipY">
              <span>Vertically</span>
            </el-button>
          </div>
        </div>
        <div class="flex flex-col gap-4 py-5">
          <h4 class="text-xs font-semibold line-clamp-1">Advanced</h4>
          <div class="grid grid-cols-3 gap-2.5">
            <div class="flex flex-col items-center justify-between">
              <Label class="text-xs shrink-0">Width (px)</Label>
              <el-input-number v-model="width" controls-position="right" :min="50" :max="100000" :precision="0" :step="5" class="text-xs h-8 w-full rounded" />
            </div>
            <div class="flex flex-col items-center justify-between">
              <Label class="text-xs shrink-0">Height (px)</Label>
              <el-input-number v-model="height" :disabled="lockRatio" controls-position="right" :min="50" :max="100000" :precision="0" :step="5" class="text-xs h-8 w-full rounded" />
            </div>
            <div class="flex flex-col items-center justify-between">
              <Label class="text-xs shrink-0">Ratio</Label>
              <Toggle v-model="lockRatio" :disabled="disabledRatio" :type="lockRatio ? 'primary' : ''" round class="!h-8 w-full" size="small" @toggle="value => lockRatio = value">
                <Lock v-if="lockRatio" :size="15" />
                <Unlock v-else :size="15" />
              </Toggle>
            </div>
            <div class="flex flex-col items-center justify-between">
              <Label class="text-xs shrink-0">Top (px)</Label>
              <el-input-number v-model="top" controls-position="right" :precision="0" :step="5" class="text-xs h-8 w-full rounded" />
            </div>
            <div class="flex flex-col items-center justify-between">
              <Label class="text-xs shrink-0">Left (px)</Label>
              <el-input-number v-model="left" controls-position="right" :precision="0" :step="5" class="text-xs h-8 w-full rounded" />
            </div>
            <div class="flex flex-col items-center justify-between">
              <Label class="text-xs shrink-0">Rotate (°)</Label>
              <el-input-number v-model="rotate" :min="-180" :max="180" controls-position="right" :precision="0" :step="45" class="text-xs h-8 w-full rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<style>
  .sidebar-container {
    .rounded {
      --el-border-radius-base: 16px;
    }
  }
</style>
