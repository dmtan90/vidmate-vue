<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Down as ChevronDown, Timeline as GanttChart, Layers } from '@icon-park/vue-next';
import Label from '@/components/ui/label.vue';
import SliderInput from '@/components/ui/SliderInput.vue';
import { useEditorStore } from '@/store/editor';
import { useCanvasStore } from '@/store/canvas';
import { storeToRefs } from "pinia";
import { cn } from '@/lib/utils';

const editor = useEditorStore();
const canvasStore = useCanvasStore();
const { canvas, selection, selectionActive: active, timeline, audio } = storeToRefs(canvasStore);
const duration = computed({
  get(){
    return (active.value?.meta?.duration / 1000);
  },

  set(value){
    canvas.value.onChangeActiveObjectTimelineProperty('duration', value * 1000);
    if(active.value?.type == 'audio'){
      audio.value.update(active.value?.name, { duration: value });
    }
  }
});

const offset = computed({
  get(){
    return (active.value?.meta.offset / 1000);
  },

  set(value){
    canvas.value.onChangeActiveObjectTimelineProperty('offset', value * 1000);
    if(active.value?.type == 'audio'){
      audio.value.update(active.value?.name, { offset: value });
    }
  }
});
</script>

<template>
  <div class="flex items-center">
    <el-button
      type="primary" text bg round
      @click="editor.setActiveSidebarRight(editor.sidebarRight === 'animations' ? null : 'animations')"
      :class="cn('gap-1.5', editor.sidebarRight === 'animations' ? 'bg-card' : '')"
    >
      <Layers :size="15" />
      <span>Animations</span>
    </el-button>
    <el-popover placement="bottom-start" trigger="click" width="200px">
      <template #reference>
        <el-button type="primary" text bg round class="data-[state=open]:bg-card">
          <GanttChart :size="15" />
          <span class="ml-1.5 mr-2">Timeline</span>
          <ChevronDown :size="15" />
        </el-button>
      </template>
      <span class="text-xs font-normal">Duration (s)</span>
      <div class="flex items-center justify-between gap-4">
        <SliderInput :model-value="duration" :min="1" :max="timeline.duration / 1000" :step="0.25" @update:model-value="(value) => duration = value"/>
      </div>
      <span class="text-xs font-normal">Offset (s)</span>
      <div class="flex items-center justify-between gap-4">
        <SliderInput :model-value="offset" :min="0" :max="timeline.duration / 1000" :step="0.25" @update:model-value="(value) => offset = value"/>
      </div>
    </el-popover>
  </div>
</template>