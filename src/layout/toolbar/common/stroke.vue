<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Down as ChevronDown } from '@icon-park/vue-next';

import Label from '@/components/ui/label.vue';
// import Popover from '@/components/ui/popover.vue';
import SliderInput from '@/components/ui/SliderInput.vue';

import { useEditorStore } from '@/store/editor';
import { useCanvasStore } from '@/store/canvas';
import { storeToRefs } from 'pinia';
import { cn } from '@/lib/utils';

const editor = useEditorStore();
const canvasStore = useCanvasStore();
const { canvas, selectionActive: selected } = storeToRefs(canvasStore);

const strokeWidth = computed({
  get(){
    return (selected.value?.strokeWidth);
  },

  set(value){
    canvas.value.onChangeActiveObjectProperty('strokeWidth', value);
  }
});

</script>

<template>
  <div class="flex items-center gap-2.5">
    <el-button
      @click="editor.setActiveSidebarRight(editor.sidebarRight === 'stroke' ? null : 'stroke')"
      type="primary" text bg round
      :class="cn('gap-1.5 px-2.5', editor.sidebarRight === 'stroke' ? 'bg-card' : '')"
    >
      <div class="relative">
        <div :class="cn('h-5 w-5 border rounded-full grid place-items-center', !selected?.stroke ? 'opacity-50' : 'opacity-100')" :style="{ backgroundColor: !selected?.stroke ? '#000000' : selected?.stroke }">
          <div class="h-2 w-2 rounded-full bg-white border" />
        </div>
        <div v-if="!selected?.stroke" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-6 bg-card-foreground -rotate-45" />
      </div>
      <span class="text-xs font-normal">Stroke</span>
    </el-button>
    <template v-if="selected?.stroke">
      <el-popover placement="bottom-start" trigger="click" width="200px">
        <template #reference>
          <el-button type="primary" text bg round class="pr-2">
            <span class="flex flex-col gap-0.5">
              <span class="h-[1px] w-4 bg-foreground/40" />
              <span class="h-[2px] w-4 bg-foreground/60" />
              <span class="h-[3px] w-4 bg-foreground/80" />
              <span />
            </span>
            <span class="text-xs mx-2 text-start tabular-nums">{{ selected.strokeWidth }} px</span>
            <ChevronDown :size="15" />
          </el-button>
        </template>
        <span class="text-xs font-normal">Stroke Width</span>
        <div class="flex items-center justify-between gap-4">
          <SliderInput :model-value="strokeWidth" :min="1" :max="100" :step="1" @update:model-value="(value) => strokeWidth = value"/>
        </div>
      </el-popover>
    </template>
  </div>
</template>