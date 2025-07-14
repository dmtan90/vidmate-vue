<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Eclipse } from 'lucide-vue-next';

import Button from '@/components/ui/button.vue';
import Input from '@/components/ui/input.vue';
import Label from '@/components/ui/label.vue';
import SliderInput from '@/components/ui/SliderInput.vue';
import PopoverRoot from '@/components/ui/popover-root.vue';
import PopoverContent from '@/components/ui/popover-content.vue';
import PopoverTrigger from '@/components/ui/popover-trigger.vue';

import { useEditorStore } from '@/store/editor';
import { useCanvasStore } from '@/store/canvas';
import { storeToRefs } from 'pinia';

const editor = useEditorStore();
// const canvas = editor.canvas;
// const selected = ref(canvas.selection?.active ?? null);
const canvasStore = useCanvasStore();
const { canvas, selectionActive: selected } = storeToRefs(canvasStore);
// const opacity = ref([(selected?.opacity ?? 0) * 100]);
// watch(canvas, (value) => {
//   // console.log("canvas", value);
//   selected.value = canvas.selection?.active ?? null;
//   // opacity.value = [(selected?.opacity ?? 0) * 100];
// });

// const onChangeOpacity = (value: number) => {
//   console.log("onChangeOpacity", value);
//   if(value < 0){
//     value = 0;
//   }
//   else if(value > 100){
//     value = 100;
//   }
//   canvas.onChangeActiveObjectProperty('opacity', value / 100);
// };

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
  <div class="flex items-center gap-4 mr-5">
    <PopoverRoot>
      <PopoverTrigger as-child>
        <Button size="sm" variant="outline" class="data-[state=open]:bg-card">
          <Eclipse :size="15" />
          <span class="ml-1.5">Opacity</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent @open-auto-focus.prevent="" class="pt-3 pb-3 px-3" align="end">
        <Label class="text-xs font-medium">Opacity (%)</Label>
        <div class="flex items-center justify-between gap-4">
          <SliderInput :value="opacity" :min="0" :max="100" :step="10" :onChange="(value) => opacity = value"/>
          <!--<Slider :min="0" :max="100" :value="[selected.opacity! * 100]" @update:model-value="([opacity]) => onChangeOpacity(opacity)" />
          <Input
            type="number"
            class="h-8 w-20 text-xs"
            :min="0"
            :max="100"
            :step="5"
            :value="Math.round(selected.opacity * 100)"
            @change="(event) => onChangeOpacity(event.target.value)"
          />-->
        </div>
      </PopoverContent>
    </PopoverRoot>
  </div>
</template>
