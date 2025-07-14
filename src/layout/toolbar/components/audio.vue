<script setup lang="ts">
import { computed } from 'vue';
import { AudioWaveform, ChevronDown, GanttChart, Trash2, Volume2, VolumeX } from 'lucide-vue-next';
import { floor } from 'lodash';

import Button from '@/components/ui/button.vue';
import Input from '@/components/ui/input.vue';
import Label from '@/components/ui/label.vue';
import PopoverRoot from '@/components/ui/popover-root.vue';
import PopoverContent from '@/components/ui/popover-content.vue';
import PopoverTrigger from '@/components/ui/popover-trigger.vue';
import Separator from '@/components/ui/separator.vue';
import SliderInput from '@/components/ui/SliderInput.vue';
import Toggle from '@/components/ui/toggle.vue';

import { useEditorStore } from '@/store/editor';
import { useCanvasStore } from '@/store/canvas';
import { storeToRefs } from 'pinia';

const editor = useEditorStore();
const canvasStore = useCanvasStore();
const { canvas, selectionActive: selected, audio, timeline } = storeToRefs(canvasStore);
// const selected = computed(() => editor.canvas.selection.active);
const volume = computed({
  get(){
    return selected.value?.volume * 100;
  },

  set(value){
    audio.value.update(selected.value?.id, { volume: value / 100 });
  }
});

const duration = computed({
  get(){
    return floor(selected.value?.timeline, 2);
  },

  set(value){
    audio.value.update(selected.value?.id, { timeline: value })
  }
});

const offset = computed({
  get(){
    console.log(timeline.value.duration / 1000 - selected.value.timeline);
    return floor(selected.value?.offset, 2);
  },

  set(value){
    audio.value.update(selected.value?.id, { offset: value })
  }
});


const muted = computed({
  get(){
    return selected.value.muted;
  },

  set(value){
    audio.value.update(selected.value.id, { muted: value })
  }
});

</script>

<template>
  <div class="flex items-center h-full w-full overflow-x-scroll scrollbar-hidden">
    <div class="flex items-center gap-2.5">
      <Button @click="editor.canvas.trimmer.start()" variant="outline" size="sm" class="gap-1.5">
        <AudioWaveform :size="15" />
        <span class="text-xs font-normal">Trim</span>
      </Button>
      <PopoverRoot>
        <PopoverTrigger as-child>
          <Button variant="outline" size="sm" class="data-[state=open]:bg-card">
            <Volume2 :size="15" />
            <span class="text-xs font-normal ml-1.5 mr-2.5">Volume</span>
            <ChevronDown :size="15" />
          </Button>
        </PopoverTrigger>
        <PopoverContent @open-auto-focus.prevent class="pt-3 pb-3 px-3 w-80" align="start">
          <Label class="text-xs font-medium">Volume (%)</Label>
          <div class="flex items-center justify-between">
            <SliderInput :value="volume" :min="0" :max="100" :step="10" :disabled="muted" :onChange="(value) => volume = value"/>
            <Toggle v-model="muted" size="sm" class="ml-3 text-gray-400 data-[state=on]:text-primary">
              <VolumeX :size="15" />
            </Toggle>
          </div>
        </PopoverContent>
      </PopoverRoot>
    </div>
    <Separator orientation="vertical" class="h-8 mx-4" />
    <div class="flex items-center gap-2.5">
      <PopoverRoot>
        <PopoverTrigger as-child>
          <Button size="sm" variant="outline" class="gap-1.5 data-[state=open]:bg-card">
            <GanttChart :size="15" />
            <span>Timeline</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent @open-auto-focus.prevent class="pt-3 pb-3 px-3" align="start">
          <Label class="text-xs font-medium">Duration (s)</Label>
          <div class="flex items-center justify-between gap-4">
            <SliderInput :value="duration" :min="1" :max="Math.min(timeline.duration / 1000, selected.duration)" :step="0.5" :onChange="(value) => duration = value"/>
          </div>
          <Label class="text-xs font-medium">Offset (s)</Label>
          <div class="flex items-center justify-between gap-4">
            <SliderInput :value="offset" :min="0" :max="(timeline.duration / 1000 - selected.timeline)" :step="0.5" :onChange="(value) => offset = value"/>
          </div>
        </PopoverContent>
      </PopoverRoot>
      <Button variant="outline" size="sm" class="gap-1.5 text-destructive hover:text-destructive" @click="audio.delete(selected.id)">
        <Trash2 :size="15" />
        <span class="text-xs font-normal">Delete</span>
      </Button>
    </div>
  </div>
</template>