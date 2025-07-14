<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { ChevronDown } from 'lucide-vue-next';

import Button from '@/components/ui/button.vue';
import Input from '@/components/ui/input.vue';
import Label from '@/components/ui/label.vue';
import PopoverRoot from '@/components/ui/popover-root.vue';
import PopoverContent from '@/components/ui/popover-content.vue';
import PopoverTrigger from '@/components/ui/popover-trigger.vue';
import SliderInput from '@/components/ui/SliderInput.vue';

import { useEditorStore } from '@/store/editor';
import { useCanvasStore } from '@/store/canvas';
import { storeToRefs } from 'pinia';
import { cn } from '@/lib/utils';

const editor = useEditorStore();
const canvasStore = useCanvasStore();
const { canvas, selectionActive: selected } = storeToRefs(canvasStore);
// const canvas = editor.canvas;
// const selected = ref(canvas.selection?.active ?? null);
// watch(canvas, (value) => {
//   // console.log("canvas", value);
//   selected.value = canvas.selection?.active ?? null
// });

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
    <Button
      @click="editor.setActiveSidebarRight(editor.sidebarRight === 'stroke' ? null : 'stroke')"
      variant="outline"
      size="sm"
      :class="cn('gap-1.5 px-2.5', editor.sidebarRight === 'stroke' ? 'bg-card' : 'bg-transparent')"
    >
      <div class="relative">
        <div :class="cn('h-5 w-5 border rounded-full grid place-items-center', !selected?.stroke ? 'opacity-50' : 'opacity-100')" :style="{ backgroundColor: !selected?.stroke ? '#000000' : selected?.stroke }">
          <div class="h-2 w-2 rounded-full bg-white border" />
        </div>
        <div v-if="!selected?.stroke" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-6 bg-card-foreground -rotate-45" />
      </div>
      <span class="text-xs font-normal">Stroke</span>
    </Button>
    <template v-if="selected?.stroke">
      <PopoverRoot>
        <PopoverTrigger as-child>
          <Button size="sm" variant="outline" class="pr-2">
            <span class="flex flex-col gap-0.5">
              <span class="h-[1px] w-4 bg-foreground/40" />
              <span class="h-[2px] w-4 bg-foreground/60" />
              <span class="h-[3px] w-4 bg-foreground/80" />
              <span />
            </span>
            <span class="text-xs mx-2 text-start tabular-nums">{{ selected.strokeWidth }} px</span>
            <ChevronDown :size="15" />
          </Button>
        </PopoverTrigger>
        <PopoverContent @open-auto-focus.prevent class="pt-2 pb-3 px-3" align="start">
          <Label class="text-xs font-medium">Stroke Width</Label>
          <div class="flex items-center justify-between gap-4">
            <SliderInput :value="strokeWidth" :min="1" :max="100" :step="1" :onChange="(value) => strokeWidth = value"/>
            <!--<Slider :min="1" :max="100" :value="[selected.strokeWidth]" @update:model-value="([strokeWidth]) => editor.canvas.onChangeActiveObjectProperty('strokeWidth', strokeWidth)" />
            <Input
              type="number"
              class="h-8 w-16 text-xs"
              :value="selected.strokeWidth"
              @update:model-value="(value) => (+value > 0 ? editor.canvas.onChangeActiveObjectProperty('strokeWidth', +value) : null)"
            />-->
          </div>
        </PopoverContent>
      </PopoverRoot>
    </template>
  </div>
</template>
