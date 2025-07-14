<script setup lang="ts">
import { computed } from 'vue';
import { Blend, Crop, Wand } from 'lucide-vue-next';

import Button from '@/components/ui/button.vue';
import Separator from '@/components/ui/separator.vue';

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
// const selected = computed(() => editor.canvas.selection.active);

</script>

<template>
  <div class="flex items-center h-full w-full overflow-x-scroll scrollbar-hidden">
    <div class="flex items-center gap-2.5">
      <Button @click="cropper.cropActiveObject()" variant="outline" size="sm" class="gap-1.5">
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
      <Button
        @click="editor.setActiveSidebarRight(editor.sidebarRight === 'clip' ? null : 'clip')"
        size="sm"
        variant="outline"
        :class="cn('gap-1.5', editor.sidebarRight === 'clip' ? 'bg-card' : 'bg-transparent', !selected?.clipPath ? 'text-foreground' : 'text-primary')"
      >
        <Blend :size="15" />
        <span>Clip Mask</span>
      </Button>
    </div>
    <Separator orientation="vertical" class="h-8 mx-4" />
    <ToolbarTimelineOption />
  </div>
</template>