<script setup lang="ts">
import { computed, watch } from 'vue';
import { ChevronUp, GanttChart, Pause, Play, Timer } from 'lucide-vue-next';

import Button from '@/components/ui/button.vue';
import DropdownMenuRoot from '@/components/ui/dropdown-menu-root.vue';
import DropdownMenuContent from '@/components/ui/dropdown-menu-content.vue';
import DropdownMenuItem from '@/components/ui/dropdown-menu-item.vue';
import DropdownMenuTrigger from '@/components/ui/dropdown-menu-trigger.vue';
import Input from '@/components/ui/input.vue';
import Label from '@/components/ui/label.vue';
import PopoverRoot from '@/components/ui/popover-root.vue';
import PopoverContent from '@/components/ui/popover-content.vue';
import PopoverTrigger from '@/components/ui/popover-trigger.vue';
import Slider from '@/components/ui/slider.vue';
import SliderInput from '@/components/ui/SliderInput.vue';

import { useIsTablet } from '@/hooks/use-media-query';
import { useEditorStore } from '@/store/editor';
import { useCanvasStore } from '@/store/canvas';
import { storeToRefs } from 'pinia';
import { formatMediaDuration } from '@/lib/time';
import { presetDurations } from '@/constants/editor';
import { cn } from '@/lib/utils';

const editor = useEditorStore();
const canvasStore = useCanvasStore();
const { canvas, timeline, animations } = storeToRefs(canvasStore);
const isTablet = useIsTablet();
// const canvas = editor.canvas;
// watch(canvasStore, (value) => {
//   console.log(value);
// });

const handleTimelineToggle = () => {
  if (timeline.value?.playing) timeline.value?.pause();
  else timeline.value?.play();
};

const disabled = computed(() => timeline.value?.playing || animations.value?.previewing);

// const onChangeDuration = (duration: number) => {
//   if(duration < 5){
//     duration = 5;
//   }
//   else if(duration > 60){
//     duration = 60;
//   }
//   console.log("onChangeDuration", duration);
//   editor.canvas.timeline.set('duration', duration)
//   // console.log("onChangeDuration", duration, editor.canvas.timeline.duration);
// };

const duration = computed({
  get(){
    return (timeline.value.duration / 1000);
  },

  set(value){
    if(value < 5){
      value = 5;
    }
    else if(value > 60){
      value = 60;
    }
    // console.log("onChangeDuration", value);
    timeline.value?.set('duration', value)
    // console.log("timeline", timeline.value);
  }
});

</script>

<template>
  <div class="h-14 sm:h-16 px-4 flex items-center gap-8 justify-between border-b shrink-0 overflow-x-scroll scrollbar-hidden">
    <template v-if="isTablet">
      <div class="flex gap-px">
        <PopoverRoot>
          <PopoverTrigger as-child>
            <Button size="sm" variant="secondary" class="gap-1.5 rounded-r-none" :disabled="disabled">
              <Timer :size="15" />
              <span>Duration</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent @open-auto-focus.prevent class="pt-2 pb-3 px-3" align="start" side="top">
            <Label class="text-xs font-medium">Duration (s)</Label>
            <div class="flex items-center justify-between gap-4">
              <SliderInput :disabled="disabled" :value="duration" :min="5" :max="60" :step="5" :onChange="(value) => duration = value"/>
            </div>
          </PopoverContent>
        </PopoverRoot>
        <DropdownMenuRoot>
          <DropdownMenuTrigger as-child>
            <Button size="icon" variant="secondary" class="rounded-l-none" :disabled="disabled">
              <ChevronUp :size="15" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent class="min-w-20" align="end" side="top">
            <DropdownMenuItem v-for="duration in presetDurations" :key="duration" :disabled="disabled" class="text-xs pl-2.5" @click="timeline.set('duration', duration)">
              {{ duration }}s
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuRoot>
      </div>
    </template>
    <template v-else>
      <div class="text-xs tabular-nums inline sm:hidden">
        <span>{{ formatMediaDuration(timeline.seek, isTablet) }}</span>
        <span class="mx-1">/</span>
        <span>{{ formatMediaDuration(timeline.duration, isTablet) }}</span>
      </div>
    </template>

    <div class="flex items-center gap-3.5">
      <div class="text-xs tabular-nums hidden sm:inline">
        <span>{{ formatMediaDuration(timeline.seek) }}</span>
        <span class="mx-1">/</span>
        <span>{{ formatMediaDuration(timeline.duration) }}</span>
      </div>
      <Button size="icon" class="rounded-full bg-card dark:bg-secondary shadow-sm border h-10 w-10 sm:h-11 sm:w-11" variant="outline" :disabled="editor.canvas.animations.previewing" @click="handleTimelineToggle">
        <template v-if="editor.canvas.timeline.playing">
          <Pause :size="20" class="fill-foreground text-foreground" />
        </template>
        <template v-else>
          <Play :size="20" class="fill-foreground text-foreground" />
        </template>
      </Button>
    </div>

    <div class="flex items-center gap-3">
      <template v-if="!isTablet">
        <PopoverRoot>
          <PopoverTrigger as-child>
            <Button size="icon" variant="secondary" :disabled="disabled">
              <Timer :size="15" />
            </Button>
          </PopoverTrigger>
          <PopoverContent @open-auto-focus.prevent class="pt-2 pb-3 px-3" align="start" side="top">
            <Label class="text-xs font-medium">Duration (s)</Label>
            <div class="flex items-center justify-between gap-4">
              <SliderInput :disabled="disabled" :value="duration" :min="5" :max="60" :step="5" :onChange="(value) => duration = value"/>
            </div>
          </PopoverContent>
        </PopoverRoot>
      </template>
      <template v-if="isTablet">
        <Button size="sm" variant="secondary" class="gap-1.5" @click="editor.onToggleTimeline()">
          <GanttChart :size="15" />
          <span>Timeline</span>
          <span :class="cn(editor.timelineOpen ? 'rotate-180' : 'rotate-0')">
            <ChevronUp :size="15" />
          </span>
        </Button>
      </template>
      <template v-else>
        <Button size="icon" variant="secondary" @click="editor.onToggleTimeline()">
          <span :class="cn(editor.timelineOpen ? 'rotate-180' : 'rotate-0')">
            <ChevronUp :size="15" />
          </span>
        </Button>
      </template>
    </div>
  </div>
</template>