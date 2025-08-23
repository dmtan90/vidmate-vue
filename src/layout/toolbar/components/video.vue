<script setup lang="ts">
import { computed } from 'vue';
import { ExcludeSelection as Blend, Movie as Clapperboard, Selected as Crop, MagicWand as Wand } from '@icon-park/vue-next';

import { ElButton, ElDivider } from 'element-plus';

import { cn } from '@/lib/utils';
import { FabricUtils } from '@/fabric/utils';
import { useEditorStore } from '@/store/editor';
import { useCanvasStore } from '@/store/canvas';
import { storeToRefs } from 'pinia';

import ToolbarStrokeOption from '../common/stroke.vue';
import ToolbarTimelineOption from '../common/timeline.vue';
import ToolbarOpacityOption from '../common/opacity.vue';

const editor = useEditorStore();
const canvasStore = useCanvasStore();
const { canvas, selectionActive: selected, trimmer, instance, cropper } = storeToRefs(canvasStore);

const handleTrimStart = () => {
  const video = instance.value?.getActiveObject();
  if (!FabricUtils.isVideoElement(video)) return;
  trimmer.value.start();
};

const volume = computed({
  get(){
    return (selected.value?.volume ?? 1) * 100;
  },

  set(value){
    canvas.value.onChangeActiveObjectProperty('volume', value / 100);
  }
});

</script>

<template>
  <div class="flex items-center h-full w-full overflow-x-scroll scrollbar-hidden">
    <div class="flex items-center">
      <!--<el-button type="primary" text bg round @click="handleTrimStart" class="gap-1.5">
        <Clapperboard :size="15" />
        <span class="text-xs font-normal">Trim</span>
      </el-button>-->
      <el-button type="primary" text bg round @click="cropper.cropActiveObject()" class="gap-1.5">
        <Crop :size="15" />
        <span class="text-xs font-normal">Crop</span>
      </el-button>
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
    <ToolbarStrokeOption />
    <el-divider direction="vertical" class="h-8" />
    <ToolbarOpacityOption />
    <el-divider direction="vertical" class="h-8" />
    <div class="flex items-center">
      <el-button
        @click="editor.setActiveSidebarRight(editor.sidebarRight === 'filters' ? null : 'filters')"
        type="primary" text bg round
        :class="cn('gap-1.5', editor.sidebarRight === 'filters' ? 'bg-card' : '', !selected?.filters?.length ? '' : 'text-foreground')"
      >
        <Wand :size="15" />
        <span>Filters</span>
      </el-button>
      <el-button type="primary" text bg round @click="editor.setActiveSidebarRight(editor.sidebarRight === 'clip' ? null : 'clip')" class="gap-1.5">
        <Blend :size="15" />
        <span>Clip Mask</span>
      </el-button>
    </div>
    <el-divider direction="vertical" class="h-8" />
    <ToolbarTimelineOption />
  </div>
</template>
