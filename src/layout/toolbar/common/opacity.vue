<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Brightness as Eclipse } from '@icon-park/vue-next';

import Label from '@/components/ui/label.vue';
import SliderInput from '@/components/ui/SliderInput.vue';
// import Popover from '@/components/ui/popover.vue';

import { useEditorStore } from '@/store/editor';
import { useCanvasStore } from '@/store/canvas';
import { storeToRefs } from 'pinia';

const editor = useEditorStore();
const canvasStore = useCanvasStore();
const { canvas, selectionActive: selected } = storeToRefs(canvasStore);

const opacity = computed({
  get(){
    return (selected.value?.opacity * 100);
  },

  set(value){
    canvas.value.onChangeActiveObjectProperty('opacity', value / 100);
  }
});
</script>

<template>
  <div class="flex items-center gap-4">
    <el-popover placement="bottom-end" trigger="click" width="200px">
      <template #reference>
        <el-button type="primary" text bg round class="data-[state=open]:bg-card">
          <Eclipse :size="15" />
          <span class="ml-1.5">Opacity</span>
        </el-button>
      </template>
      <span class="text-xs font-normal">Opacity (%)</span>
      <div class="flex items-center justify-between gap-4">
        <SliderInput :model-value="opacity" :min="0" :max="100" :step="10" @update:model-value="(value) => opacity = value"/>
      </div>
    </el-popover>
  </div>
</template>