<script setup lang="ts">
import { computed } from 'vue';
import { Blend, Clapperboard, Crop, Wand } from 'lucide-vue-next';

import Button from '@/components/ui/button.vue';
import Separator from '@/components/ui/separator.vue';

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
const { selectionActive: selected, trimmer, instance } = storeToRefs(canvasStore);
// const selected = computed(() => editor.canvas.selection.active);

const handleTrimStart = () => {
  const video = instance.value?.getActiveObject();
  if (!FabricUtils.isVideoElement(video)) return;
  trimmer.value.start();
};

</script>

<template>
  <div class="flex items-center h-full w-full overflow-x-scroll scrollbar-hidden">
    <div class="flex items-center gap-2.5">
      <Button @click="handleTrimStart" variant="outline" size="sm" class="gap-1.5">
        <Clapperboard :size="15" />
        <span class="text-xs font-normal">Trim</span>
      </Button>
      <Button @click="editor.canvas.cropper.cropActiveObject()" variant="outline" size="sm" class="gap-1.5">
        <Crop :size="15" />
        <span class="text-xs font-normal">Crop</span>
      </Button>
    </div>
    <Separator orientation="vertical" class="h-8 mx-4" />
    <ToolbarStrokeOption />
    <Separator orientation="vertical" class="h-8 mx-4" />
    <ToolbarOpacityOption />
    <Separator orientation="vertical" class="h-8 mr-4" />
    <div class="flex items-center gap-4">
      <Button
        @click="editor.setActiveSidebarRight(editor.sidebarRight === 'filters' ? null : 'filters')"
        size="sm"
        variant="outline"
        :class="cn('gap-1.5', editor.sidebarRight === 'filters' ? 'bg-card' : 'bg-transparent', !selected?.filters?.length ? 'text-foreground' : 'text-primary')"
      >
        <Wand :size="15" />
        <span>Filters</span>
      </Button>
      <Button @click="editor.setActiveSidebarRight(editor.sidebarRight === 'clip' ? null : 'clip')" size="sm" variant="outline" class="gap-1.5">
        <Blend :size="15" />
        <span>Clip Mask</span>
      </Button>
    </div>
    <Separator orientation="vertical" class="h-8 mx-4" />
    <ToolbarTimelineOption />
  </div>
</template>