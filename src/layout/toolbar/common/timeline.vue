<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { ChevronDown, GanttChart, Layers } from 'lucide-vue-next';

import Button from '@/components/ui/button.vue';
import Input from '@/components/ui/input.vue';
import Label from '@/components/ui/label.vue';
import PopoverRoot from '@/components/ui/popover-root.vue';
import PopoverContent from '@/components/ui/popover-content.vue';
import PopoverTrigger from '@/components/ui/popover-trigger.vue';
import SliderInput from '@/components/ui/SliderInput.vue';

import { useEditorStore } from '@/store/editor';
import { useCanvasStore } from '@/store/canvas';
import { storeToRefs } from "pinia";
import { cn } from '@/lib/utils';

const editor = useEditorStore();
const canvasStore = useCanvasStore();
const { canvas, selection, selectionActive: active, timeline } = storeToRefs(canvasStore);
// const canvas = editor.canvas;
// const selected = ref(canvas.selection?.active ?? null);
// watch(canvas, (value) => {
//   // console.log("canvas", value);
//   selected.value = canvas.selection?.active ?? null
// });
const duration = computed({
  get(){
    return (active.value?.meta.duration / 1000);
  },

  set(value){
    canvas.value.onChangeActiveObjectTimelineProperty('duration', value * 1000);
  }
});

const offset = computed({
  get(){
    return (active.value?.meta.offset / 1000);
  },

  set(value){
    canvas.value.onChangeActiveObjectTimelineProperty('offset', value * 1000);
  }
});
</script>

<template>
  <div class="flex items-center gap-4">
    <Button
      size="sm"
      variant="outline"
      @click="editor.setActiveSidebarRight(editor.sidebarRight === 'animations' ? null : 'animations')"
      :class="cn('gap-1.5', editor.sidebarRight === 'animations' ? 'bg-card' : 'bg-transparent')"
    >
      <Layers :size="15" />
      <span>Animations</span>
    </Button>
    <PopoverRoot>
      <PopoverTrigger as-child>
        <Button size="sm" variant="outline" class="data-[state=open]:bg-card">
          <GanttChart :size="15" />
          <span class="ml-1.5 mr-2">Timeline</span>
          <ChevronDown :size="15" />
        </Button>
      </PopoverTrigger>
      <PopoverContent @open-auto-focus.prevent class="pt-3 pb-3 px-3" align="start">
        <Label class="text-xs font-medium">Duration (s)</Label>
        <div class="flex items-center justify-between gap-4">
          <SliderInput :value="duration" :min="1" :max="timeline.duration / 1000" :step="0.25" :onChange="(value) => duration = value"/>
        </div>
        <Label class="text-xs font-medium">Offset (s)</Label>
        <div class="flex items-center justify-between gap-4">
          <SliderInput :value="offset" :min="0" :max="timeline.duration / 1000" :step="0.25" :onChange="(value) => offset = value"/>
        </div>
      </PopoverContent>
    </PopoverRoot>
  </div>
</template>
