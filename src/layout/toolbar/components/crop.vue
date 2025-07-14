<script setup lang="ts">
import { Check, CornerUpLeft, FlipHorizontal2, FlipVertical2 } from 'lucide-vue-next';

import Button from '@/components/ui/button.vue';
import Separator from '@/components/ui/separator.vue';
import TooltipRoot from '@/components/ui/tooltip-root.vue';
import TooltipContent from '@/components/ui/tooltip-content.vue';
import TooltipTrigger from '@/components/ui/tooltip-trigger.vue';

import { useEditorStore } from '@/store/editor';
import { useCanvasStore } from '@/store/canvas';
import { storeToRefs } from 'pinia';

const editor = useEditorStore();
const canvasStore = useCanvasStore();
const { canvas, cropperActive: active, instance } = storeToRefs(canvasStore);
// const cropper = editor.canvas.cropper;

const handleCropEnd = () => {
  // const active = cropper.active;
  instance.value.discardActiveObject();
  if (active.value) instance.value.setActiveObject(active.value);
};

const handleFlipImage = (property: "flipX" | "flipY") => {
  canvas.value.onChangeImageProperty(active.value!, property, !active![property]);
};

</script>

<template>
  <div class="flex items-center h-full w-full overflow-x-scroll scrollbar-hidden">
    <Button size="sm" class="gap-1.5 pl-2.5 bg-primary hover:bg-primary/90" @click="handleCropEnd">
      <Check :size="15" />
      <span>Done</span>
    </Button>
    <Separator orientation="vertical" class="h-8 mx-4" />
    <div class="flex items-center gap-2.5">
      <TooltipRoot>
        <TooltipTrigger as-child>
          <Button variant="outline" size="icon" @click="handleFlipImage('flipX')">
            <FlipHorizontal2 :size="15" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" :side-offset="8">
          Mirror image horizontally
        </TooltipContent>
      </TooltipRoot>
      <TooltipRoot>
        <TooltipTrigger as-child>
          <Button variant="outline" size="icon" @click="handleFlipImage('flipY')">
            <FlipVertical2 :size="15" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" :side-offset="8">
          Mirror image vertically
        </TooltipContent>
      </TooltipRoot>
    </div>
    <Separator orientation="vertical" class="h-8 mx-4" />
    <Button variant="outline" size="sm" class="gap-1.5">
      <CornerUpLeft :size="15" />
      <span>Reset</span>
    </Button>
  </div>
</template>