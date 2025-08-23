<script setup lang="ts">
import { computed } from 'vue';
import { WavesLeft as AudioWaveform, Down as ChevronDown, Timeline as GanttChart, Delete as Trash2, VolumeNotice as Volume2, VolumeMute as VolumeX } from '@icon-park/vue-next';
import { floor } from 'lodash';
import { cn } from '@/lib/utils';

import Label from '@/components/ui/label.vue';
import SliderInput from '@/components/ui/SliderInput.vue';
import Toggle from '@/components/ui/toggle.vue';

import ToolbarFillOption from '../common/fill.vue';
import ToolbarStrokeOption from '../common/stroke.vue';
import ToolbarTimelineOption from '../common/timeline.vue';
import ToolbarOpacityOption from '../common/opacity.vue';

import { useEditorStore } from '@/store/editor';
import { useCanvasStore } from '@/store/canvas';
import { storeToRefs } from 'pinia';

const editor = useEditorStore();
const canvasStore = useCanvasStore();
const { canvas, selectionActive: selected, audio, timeline, trimmer } = storeToRefs(canvasStore);
const volume = computed({
  get(){
    return (selected.value?.volume ?? 1) * 100;
  },

  set(value){
    // audio.value.update(selected.value?.id, { volume: value / 100 });
    audio.value.update(selected.value?.name, { volume: value / 100 });
    canvas.value.onChangeActiveObjectProperty('volume', value / 100);
  }
});

const duration = computed({
  get(){
    // return floor(selected.value?.timeline, 2);
    return (selected.value?.meta?.duration / 1000);
  },

  set(value){
    // audio.value.update(selected.value?.id, { timeline: value })
    audio.value.update(selected.value?.name, { timeline: value })
    canvas.value.onChangeActiveObjectTimelineProperty('duration', value * 1000);
  }
});

const offset = computed({
  get(){
    // return floor(selected.value?.offset, 2);
    return (selected.value?.meta.offset / 1000);
  },

  set(value){
    // audio.value.update(selected.value?.id, { offset: value })
    audio.value.update(selected.value?.name, { offset: value })
    canvas.value.onChangeActiveObjectTimelineProperty('offset', value * 1000);
  }
});


const muted = computed({
  get(){
    return selected.value?.muted || selected.value?.volume == 0;
  },

  set(value){
    // audio.value.update(selected.value.id, { muted: value })
    audio.value.update(selected.value.name, { muted: value })
    canvas.value.onChangeActiveObjectProperty('muted', value);
  }
});

const handleDelete = () => {
  audio.value.delete(selected.value.name);
}

</script>

<template>
  <div class="flex items-center h-full w-full overflow-x-scroll scrollbar-hidden">
    <div class="flex items-center">
      <el-button type="primary" text bg round 
        :class="cn('gap-1.5 mr-2.5 justify-start px-2.5 relative', editor.sidebarRight === 'visual' ? 'bg-card' : '')"
        @click="editor.setActiveSidebarRight(editor.sidebarRight === 'visual' ? null : 'visual')">
        <div class="relative">
          <AudioWaveform :size="15" />
          <div v-if="!selected?.visible" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-6 bg-card-foreground -rotate-45" />
        </div>
        <span class="text-xs font-normal">Visual</span>
      </el-button>
      <template v-if="selected.visible">
        <ToolbarFillOption class="mr-2.5"/>
        <ToolbarStrokeOption class="mr-2.5"/>
        <ToolbarOpacityOption />
      </template>
      <el-divider direction="vertical" class="h-8" />
      <el-popover placement="bottom-start" trigger="click" width="300px">
        <template #reference>
          <el-button type="primary" text bg round class="data-[state=open]:bg-card">
            <Volume2 :size="15" />
            <span class="text-xs font-normal ml-1.5 mr-2.5">Volume</span>
            <ChevronDown :size="15" />
          </el-button>
        </template>
        <Label class="text-xs font-medium">Volume (%)</Label>
        <div class="flex items-center justify-between">
          <SliderInput :model-value="volume" :min="0" :max="100" :step="10" :disabled="muted" @update:model-value="(value) => volume = value"/>
          <Toggle v-model="muted" circle class="ml-1" @toggle="value => muted = value">
            <VolumeX :size="15" />
          </Toggle>
        </div>
      </el-popover>
    </div>
    <el-divider direction="vertical" class="h-8" />
    <ToolbarTimelineOption />
    <!--<div class="flex items-center">
      <el-popover placement="bottom-start" trigger="click" width="200px">
        <template #reference>
          <el-button type="primary" text bg round class="gap-1.5 data-[state=open]:bg-card">
            <GanttChart :size="15" />
            <span>Timeline</span>
          </el-button>
        </template>
        <Label class="text-xs font-medium">Duration (s)</Label>
        <div class="flex items-center justify-between gap-4">
          <SliderInput :model-value="duration" :min="1" :max="Math.min(timeline.duration / 1000, selected.duration)" :step="0.5" @update:model-value="(value) => duration = value"/>
        </div>
        <Label class="text-xs font-medium">Offset (s)</Label>
        <div class="flex items-center justify-between gap-4">
          <SliderInput :model-value="offset" :min="0" :max="(timeline.duration / 1000 - selected.timeline)" :step="0.5" @update:model-value="(value) => offset = value"/>
        </div>
      </el-popover>
      <el-button type="danger" text bg round class="gap-1.5 text-destructive hover:text-destructive" @click="">
        <Trash2 :size="15" />
        <span class="text-xs font-normal">Delete</span>
      </el-button>
    </div>-->
  </div>
</template>
