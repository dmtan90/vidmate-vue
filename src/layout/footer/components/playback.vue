<script setup lang="ts">
import { computed, watch } from 'vue';
import { Up as ChevronUp, Timeline as GanttChart, Pause, Play, Timer, CuttingOne as Split, Copy, Delete as Trash2Icon } from '@icon-park/vue-next';
import Label from '@/components/ui/label.vue';
import SliderInput from '@/components/ui/SliderInput.vue';
import { useIsTablet } from '@/hooks/use-media-query';
import { useEditorStore } from '@/store/editor';
import { useCanvasStore } from '@/store/canvas';
import { storeToRefs } from 'pinia';
import { formatMediaDuration } from '@/lib/time';
import { presetDurations, MIN_DURATION, MAX_DURATION } from '@/constants/editor';
import { cn } from '@/lib/utils';
const editor = useEditorStore();
const canvasStore = useCanvasStore();
const { canvas, timeline, animations, selectionActive: active, trimmer, cloner, audio, instance } = storeToRefs(canvasStore);
const isTablet = useIsTablet();

const handleTimelineToggle = () => {
  if (timeline.value?.playing) timeline.value?.pause();
  else timeline.value?.play();
};

const disabled = computed(() => timeline.value?.playing || animations.value?.previewing);

const duration = computed({
  get(){
    return (timeline.value.duration / 1000);
  },

  set(value){
    if(value < MIN_DURATION){
      value = MIN_DURATION;
    }
    else if(value > MAX_DURATION){
      value = MAX_DURATION;
    }
    timeline.value?.set('duration', value)
  }
});

const onSplitItem = async () => {
  console.log("onSplitItem", active, timeline)
  const seekTimeInSeconds = timeline.value?.seek / 1000;
  const object = active.value;
  if(!object){
    return;
  }

  const _object = instance.value?.getActiveObject();
  const cloned = await cloner.value?.clone(_object);
  if(object.type == 'audio' || object.type == 'video'){
    const trimStart = cloned.trimStart;
    const trimEnd = cloned.trimEnd;
    const duration = cloned.meta.duration;//in ms
    const offset = cloned.meta.offset;//in ms
    const _trim = seekTimeInSeconds - offset/1000;
    const newTrimStart = trimStart + _trim;
    const newTrimEnd = trimEnd + _trim;
    const newDuration = offset + duration - seekTimeInSeconds*1000;
    const newMeta = { duration: newDuration, offset: seekTimeInSeconds * 1000};
    const _duration = seekTimeInSeconds*1000 - object.meta.offset;
    const _trimEnd = trimStart + _duration/1000;

    if(object.type == 'video'){
      //update clone object
      canvas.value.onChangeVideoProperty(cloned, "trimStart", newTrimStart);
      canvas.value.onChangeVideoProperty(cloned, "trimEnd", newTrimEnd);
      canvas.value.onChangeVideoProperty(cloned, "meta", newMeta);
      
      //update origin object
      canvas.value.onChangeVideoProperty(_object, "trimEnd", newTrimEnd);
      canvas.value.onChangeVideoProperty(_object, "meta", { duration: _duration, offset: offset });
    }
    else{
      audio.value?.update(cloned.name, { offset: newMeta.offset/1000, trim: newTrimStart/1000, timeline: newMeta.duration/1000 });
      audio.value?.update(_object.name, { timeline: _duration/1000 });
    }
    const __object = instance.value.getItemByName(_object.name);
    console.log("_object", _object);
  }

  // //check time out of range
  // if(object.type == 'audio'){
  //   //clone current object and split
  //   const _audio = audio.value.get(object.name);
  //   // const cloned = await cloner.value?.clone(_object);
  //   // console.log(cloned);
  //   //update cloned object first
  //   const lastOffset = _audio.offset;
  //   const newOffset = seekTimeInSeconds;
  //   const lastTrim = _audio.trim;
  //   const newTrim = lastTrim + seekTimeInSeconds - lastOffset;
  //   const lastTimeline = _audio.timeline;
  //   const newTimeline = lastOffset + lastTimeline - seekTimeInSeconds;
  //   audio.value?.update(cloned.id, { offset: newOffset, trim: newTrim, timeline: newTimeline });
    
  //   const _timeline = seekTimeInSeconds - active.value.offset;
  //   audio.value?.update(_audio.id, { timeline: _timeline });
  // }
  // else if(object.type == 'video'){
  //   //clone current object and split
  //   // const _object = instance.value?.getActiveObject();
  //   // console.log(cloned);
  //   const trimStart = cloned.trimStart;
  //   const trimEnd = cloned.trimEnd;
  //   const duration = cloned.meta.duration;//in ms
  //   const offset = cloned.meta.offset;//in ms
  //   const _trim = seekTimeInSeconds - offset/1000;
  //   const newTrimStart = trimStart + _trim;
  //   const newTrimEnd = trimEnd + _trim;
  //   const newDuration = offset + duration - seekTimeInSeconds*1000;
  //   const newMeta = { duration: newDuration, offset: seekTimeInSeconds * 1000};
  //   canvas.value.onChangeVideoProperty(cloned, "trimStart", newTrimStart);
  //   canvas.value.onChangeVideoProperty(cloned, "trimEnd", newTrimEnd);
  //   canvas.value.onChangeVideoProperty(cloned, "meta", newMeta);

  //   // const trimStart = active.value.trimStart;
  //   // const trimEnd = active.value.trimEnd;
  //   // const duration = active.value.meta.duration;//in ms
  //   // const offset = active.value.meta.offset;//in ms
  //   const _duration = seekTimeInSeconds*1000 - object.meta.offset;
  //   const _trimEnd = trimStart + _duration/1000;
  //   // trimmer.value?.start();
  //   // const trimStart = (data.value.trimStartX / containerWidth.value) * data.value.duration;
  //   // const trimEnd = ((containerWidth.value - data.value.trimEndX) / containerWidth.value) * data.value.duration;
  //   // canvas.value.onChangeVideoProperty(object, "trimStart", newTrimStart);
  //   canvas.value.onChangeVideoProperty(_object, "trimEnd", newTrimEnd);
  //   canvas.value.onChangeVideoProperty(_object, "meta", { duration: _duration, offset: offset });
  //   const __object = instance.value.getItemByName(_object.name);
  //   console.log("_object", _object);
  // }
};

const onCloneItem = async () => {
  console.log("onCloneItem", active);
  const object = active.value;
  let cloned = null;
  if(!object){
    return cloned;
  }

  //clone current object
  const _object = instance.value?.getActiveObject();
  cloned = await cloner.value?.clone(_object);
  return cloned;
};

const onRemoveItem = () => {
  console.log("onRemoveItem", active);
  const object = active.value;
  if(!object){
    return;
  }
  
  if(object.type == 'audio'){
    audio.value?.delete(object.name)
  }
  else{
    canvas.value.onDeleteObject(object);  
  }
};

const splitEnabled = computed(() => {
  const seekTimeInSeconds = timeline.value?.seek / 1000;
  const object = active.value;
  if(!object){
    return false;
  }
  let isSplited = false;
  let start = 0;
  let end = 0;
  if(object.type == "video" || object.type == "audio"){
    start = object.meta.offset / 1000;
    end = object.meta.duration / 1000 + start;
  }

  if(start != end && start < seekTimeInSeconds && seekTimeInSeconds < end){
    isSplited = true;
  }
  return isSplited;
});

</script>

<template>
  <div class="h-14 sm:h-16 px-4 flex items-center gap-8 justify-between border-b shrink-0 overflow-x-scroll scrollbar-hidden">
    <div class="flex items-center gap-3.5">
      <el-button size="large" circle type="primary" text bg :disabled="editor.canvas.animations.previewing" @click="handleTimelineToggle">
        <template v-if="editor.canvas.timeline.playing">
          <Pause :size="32" />
        </template>
        <template v-else>
          <Play :size="32" />
        </template>
      </el-button>
      <div class="text-xs tabular-nums hidden sm:inline">
        <span>{{ formatMediaDuration(timeline.seek) }}</span>
        <span class="mx-1">/</span>
        <span>{{ formatMediaDuration(timeline.duration) }}</span>
      </div>
      <el-divider direction="vertical" class="h-8" v-if="active"/>
      <div class="flex items-center gap-0" v-if="active">
        <el-button-group>
          <el-tooltip content="Split" placement="top" v-if="splitEnabled">
            <el-button text round :icon="Split" @click="onSplitItem()" />
          </el-tooltip>
          <el-tooltip content="Copy" placement="top" v-if="!active?.meta?.thumbnail">
            <el-button text round :icon="Copy" @click="onCloneItem()" />
          </el-tooltip>
          <el-tooltip content="Delete" placement="top">
            <el-button type="danger" text round :icon="Trash2Icon"  @click="onRemoveItem()" />
          </el-tooltip>
        </el-button-group>
      </div>
    </div>

    <!--<template v-if="isTablet">
      <div class="flex gap-px">
        <el-popover placement="top-start" trigger="click" width="250px">
          <template #reference>
            <el-button type="primary" text bg round class="gap-1.5 rounded-r-none" :disabled="disabled">
              <Timer :size="15" />
              <span>Duration</span>
            </el-button>
          </template>
          <Label class="text-xs font-medium">Duration (s)</Label>
          <div class="flex items-center justify-between gap-4">
            <SliderInput :disabled="disabled" :model-value="duration" :min="5" :max="60" :step="5" @update:model-value="(value) => duration = value"/>
          </div>
        </el-popover>
        <el-dropdown @command="duration => timeline.set('duration', duration)">
          <el-button type="primary" text bg round class="rounded-l-none" :disabled="disabled">
            <ChevronUp :size="15" />
          </el-button>
          <template #dropdown>
            <el-dropdown-menu class="min-w-20">
              <el-dropdown-item v-for="item in presetDurations" :key="item.value" :disabled="disabled || duration == item.value" :command="item.value" class="text-xs pl-2.5">
                {{ item.label }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </template>
    <template v-else>
      <div class="text-xs tabular-nums inline sm:hidden">
        <span>{{ formatMediaDuration(timeline.seek, isTablet) }}</span>
        <span class="mx-1">/</span>
        <span>{{ formatMediaDuration(timeline.duration, isTablet) }}</span>
      </div>
    </template>-->

    <div class="flex items-center gap-3">
      <template v-if="isTablet">
        <div class="flex gap-0">
          <el-popover placement="top-start" trigger="click" width="250px">
            <template #reference>
              <el-button type="primary" text bg round class="gap-1.5 rounded-r-none" :disabled="disabled">
                <Timer :size="15" />
                <span>Duration</span>
              </el-button>
            </template>
            <Label class="text-xs font-medium">Duration (s)</Label>
            <div class="flex items-center justify-between gap-4">
              <SliderInput :disabled="disabled" :model-value="duration" :min="MIN_DURATION" :max="MAX_DURATION" :step="5" @update:model-value="(value) => duration = value"/>
            </div>
          </el-popover>
          <el-dropdown @command="duration => timeline.set('duration', duration)">
            <el-button type="primary" text bg round class="rounded-l-none" :disabled="disabled">
              <ChevronUp :size="15" />
            </el-button>
            <template #dropdown>
              <el-dropdown-menu class="min-w-20">
                <el-dropdown-item v-for="item in presetDurations" :key="item.value" :disabled="disabled || duration == item.value" :command="item.value" class="text-xs pl-2.5">
                  {{ item.label }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </template>
      <template v-else>
        <div class="text-xs tabular-nums inline sm:hidden">
          <span>{{ formatMediaDuration(timeline.seek, isTablet) }}</span>
          <span class="mx-1">/</span>
          <span>{{ formatMediaDuration(timeline.duration, isTablet) }}</span>
        </div>
      </template>
      <template v-if="!isTablet">
        <el-popover placement="top-start" trigger="click" width="200px">
          <template #reference>
            <el-button type="primary" text bg round :disabled="disabled">
              <Timer :size="15" />
            </el-button>
          </template>
          <Label class="text-xs font-medium">Duration (s)</Label>
          <div class="flex items-center justify-between gap-4">
            <SliderInput :disabled="disabled" :model-value="duration" :min="5" :max="60" :step="5" @update:model-value="(value) => duration = value"/>
          </div>
        </el-popover>
      </template>
      <template v-if="isTablet">
        <el-button type="primary" text bg round class="gap-1.5" @click="editor.onToggleTimeline()">
          <GanttChart :size="15" />
          <span>Timeline</span>
          <span :class="cn(editor.timelineOpen ? 'rotate-180' : 'rotate-0')">
            <ChevronUp :size="15" />
          </span>
        </el-button>
      </template>
      <template v-else>
        <el-button type="primary" text bg round @click="editor.onToggleTimeline()">
          <span :class="cn(editor.timelineOpen ? 'rotate-180' : 'rotate-0')">
            <ChevronUp :size="15" />
          </span>
        </el-button>
      </template>
    </div>
  </div>
</template>
