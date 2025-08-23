<script setup lang="ts">
import { Check, CornerUpLeft, FlipHorizontally, FlipVertically } from '@icon-park/vue-next';

import { ElButton, ElDivider, ElTooltip } from 'element-plus';

import { useEditorStore } from '@/store/editor';
import { useCanvasStore } from '@/store/canvas';
import { storeToRefs } from 'pinia';

const editor = useEditorStore();
const canvasStore = useCanvasStore();
const { canvas, cropperActive: active, instance } = storeToRefs(canvasStore);

const handleCropEnd = () => {
  instance.value.discardActiveObject();
  if (active.value) instance.value.setActiveObject(active.value);
};

const handleFlipImage = (property: "flipX" | "flipY") => {
  canvas.value.onChangeImageProperty(active.value!, property, !active![property]);
};

</script>

<template>
  <div class="flex items-center h-full w-full overflow-x-scroll scrollbar-hidden">
    <el-button plain class="gap-1.5 pl-2.5 bg-primary hover:bg-primary/90" @click="handleCropEnd">
      <Check :size="15" />
      <span>Done</span>
    </el-button>
    <el-divider direction="vertical" class="h-8" />
    <div class="flex items-center gap-2.5">
      <el-tooltip content="Mirror image horizontally" placement="bottom">
        <el-button plain @click="handleFlipImage('flipX')">
          <FlipHorizontal2 :size="15" />
        </el-button>
      </el-tooltip>
      <el-tooltip content="Mirror image vertically" placement="bottom">
        <el-button plain @click="handleFlipImage('flipY')">
          <FlipVertical2 :size="15" />
        </el-button>
      </el-tooltip>
    </div>
    <el-divider direction="vertical" class="h-8" />
    <el-button plain class="gap-1.5">
      <CornerUpLeft :size="15" />
      <span>Reset</span>
    </el-button>
  </div>
</template>
