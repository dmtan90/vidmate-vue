<script setup lang="ts">
import { computed } from 'vue';
import { ExcludeSelection as Blend, Selected as Crop, MagicWand as Wand } from '@icon-park/vue-next';

import { ElButton, ElDivider } from 'element-plus';

import { cn } from '@/lib/utils';
import { useEditorStore } from '@/store/editor';
import { useCanvasStore } from '@/store/canvas';
import { storeToRefs } from 'pinia';

import ToolbarStrokeOption from '../common/stroke.vue';
import ToolbarTimelineOption from '../common/timeline.vue';
import ToolbarOpacityOption from '../common/opacity.vue';

const editor = useEditorStore();
const canvasStore = useCanvasStore();
const { canvas, selectionActive: selected, cropper } = storeToRefs(canvasStore);

</script>

<template>
  <div class="flex items-center h-full w-full overflow-x-scroll scrollbar-hidden">
    <div class="flex items-center gap-2.5">
      <el-button type="primary" text bg round @click="cropper.cropActiveObject()" plain class="gap-1.5">
        <Crop :size="15" />
        <span class="text-xs font-normal">Crop</span>
      </el-button>
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
      <el-button
        @click="editor.setActiveSidebarRight(editor.sidebarRight === 'clip' ? null : 'clip')"
        type="primary" text bg round
        :class="cn('gap-1.5', editor.sidebarRight === 'clip' ? 'bg-card' : '', !selected?.clipPath ? '' : 'text-foreground')"
      >
        <Blend :size="15" />
        <span>Clip Mask</span>
      </el-button>
    </div>
    <el-divider direction="vertical" class="h-8" />
    <ToolbarTimelineOption />
  </div>
</template>
