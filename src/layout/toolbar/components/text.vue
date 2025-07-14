<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { AlignCenter, AlignJustify, AlignLeft, AlignRight, ArrowDownZA, Bold, CaseLower, CaseUpper, ChevronDown, Italic, Ligature, Underline, WholeWord } from 'lucide-vue-next';

import Button from '@/components/ui/button.vue';
import DropdownMenuRoot from '@/components/ui/dropdown-menu-root.vue';
import DropdownMenuContent from '@/components/ui/dropdown-menu-content.vue';
import DropdownMenuItem from '@/components/ui/dropdown-menu-item.vue';
import DropdownMenuTrigger from '@/components/ui/dropdown-menu-trigger.vue';
import Input from '@/components/ui/input.vue';
import Separator from '@/components/ui/separator.vue';
import Toggle from '@/components/ui/toggle.vue';
import ToggleGroup from '@/components/ui/toggle-group.vue';
import ToggleGroupItem from '@/components/ui/toggle-group-item.vue';
import PopoverRoot from '@/components/ui/popover-root.vue';
import PopoverContent from '@/components/ui/popover-content.vue';
import PopoverTrigger from '@/components/ui/popover-trigger.vue';
import Label from '@/components/ui/label.vue';
// import Slider from '@/components/ui/slider.vue';
import SliderInput from '@/components/ui/SliderInput.vue';

import { fontSizes } from '@/constants/editor';
import { useEditorStore } from '@/store/editor';
import { cn } from '@/lib/utils';
import { useCanvasStore } from "@/store/canvas";
import { storeToRefs } from "pinia";

import ToolbarFillOption from '../common/fill.vue';
import ToolbarStrokeOption from '../common/stroke.vue';
import ToolbarTimelineOption from '../common/timeline.vue';
import ToolbarOpacityOption from '../common/opacity.vue';

const editor = useEditorStore();
const canvasStore = useCanvasStore();
const { canvas, selectionActive: active } = storeToRefs(canvasStore);
// watch(active, () => {
//   console.log(active);
// });

const fontWeight = computed({
  get(){
    return (active.value?.fontWeight == 700);
  },

  set(value){
    canvas.value.onChangeActiveTextboxProperty('fontWeight', value ? 700 : 400)
  }
});

const fontStyle = computed({
  get(){
    return (active.value?.fontStyle == 'italic');
  },

  set(value){
    canvas.value.onChangeActiveTextboxProperty('fontStyle', value ? 'italic' : 'normal')
  }
});

const underline = computed({
  get(){
    return active.value?.underline;
  },

  set(value){
    canvas.value.onChangeActiveTextboxProperty('underline', value)
  }
});

const textAlign = computed({
  get(){
    return active.value?.textAlign;
  },

  set(value){
    canvas.value.onChangeActiveTextboxProperty('textAlign', value)
  }
});

const textTransform = computed({
  get(){
    return active.value?.textTransform;
  },

  set(value){
    canvas.value.onChangeActiveTextboxProperty('textTransform', value)
  }
});

const charSpacing = computed({
  get(){
    return active.value?.charSpacing;
  },

  set(value){
    canvas.value.onChangeActiveTextboxProperty('charSpacing', value)
  }
});

const lineHeight = computed({
  get(){
    return active.value?.lineHeight;
  },

  set(value){
    canvas.value.onChangeActiveTextboxProperty('lineHeight', value)
  }
});

</script>

<template>
  <div class="flex items-center h-full w-full overflow-x-scroll scrollbar-hidden">
    <div class="flex items-center gap-4">
      <Button
        size="sm"
        variant="outline"
        :class="cn('gap-1.5 justify-start px-2.5', editor.sidebarRight === 'fonts' ? 'bg-card' : 'bg-transparent')"
        @click="editor.setActiveSidebarRight(editor.sidebarRight === 'fonts' ? null : 'fonts')"
      >
        <Ligature :size="15" class="shrink-0" />
        <span class="text-start text-ellipsis whitespace-nowrap overflow-hidden w-20">{{ active.fontFamily || 'Inter' }}</span>
        <ChevronDown :size="15" class="ml-auto shrink-0" />
      </Button>
      <div class="relative">
        <Input
          class="h-8 w-28 text-xs pr-[3.25rem] stepper-hidden"
          type="number"
          :value="active.fontSize * active.scaleY"
          @update:model-value="(value) => (+value <= 0 ? null : canvas.onChangeActiveTextboxProperty('fontSize', +value / active.scaleY))"
        />
        <span class="absolute right-8 top-1/2 -translate-y-1/2 text-xs">px</span>
        <DropdownMenuRoot>
          <DropdownMenuTrigger as-child>
            <Button size="icon" variant="outline" class="!h-5 !w-5 absolute right-1.5 top-1/2 -translate-y-1/2 rounded-sm bg-card border shadow-none hover:bg-card">
              <ChevronDown :size="14" class="text-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent class="min-w-24 max-h-64 overflow-y-auto" align="end" :align-offset="-6" :side-offset="12">
            <DropdownMenuItem v-for="size in fontSizes" :key="size" class="text-xs pl-2.5" @click="canvas.onChangeActiveTextboxProperty('fontSize', Math.floor(size / active.scaleY))">
              {{ size }} px
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuRoot>
      </div>
    </div>
    <Separator orientation="vertical" class="h-8 mx-4" />
    <div class="flex items-center gap-1">
      <Toggle
        v-model="fontWeight"
        variant="outline"
        size="sm"
        aria-label="bold"
        class="data-[state=on]:bg-card data-[state=on]:text-primary"
      >
        <Bold :size="15" />
      </Toggle>
      <Toggle
        v-model="fontStyle"
        variant="outline"
        class="data-[state=on]:bg-card data-[state=on]:text-primary"
        size="sm"
        aria-label="italic"
      >
        <Italic :size="15" />
      </Toggle>
      <Toggle
        v-model="underline"
        variant="outline"
        size="sm"
        aria-label="underline"
        class="data-[state=on]:bg-card data-[state=on]:text-primary"
      >
        <Underline :size="15" />
      </Toggle>
    </div>
    <Separator orientation="vertical" class="h-8 mx-4" />
    <ToggleGroup type="single" v-model="textAlign" class="flex items-center gap-1">
      <ToggleGroupItem variant="outline" size="sm" value="left" aria-label="left" class="data-[state=on]:bg-card data-[state=on]:text-primary">
        <AlignLeft :size="15" />
      </ToggleGroupItem>
      <ToggleGroupItem variant="outline" size="sm" value="center" aria-label="center" class="data-[state=on]:bg-card data-[state=on]:text-primary">
        <AlignCenter :size="15" />
      </ToggleGroupItem>
      <ToggleGroupItem variant="outline" size="sm" value="right" aria-label="right" class="data-[state=on]:bg-card data-[state=on]:text-primary">
        <AlignRight :size="15" />
      </ToggleGroupItem>
      <ToggleGroupItem variant="outline" size="sm" value="justify" aria-label="justify" class="data-[state=on]:bg-card data-[state=on]:text-primary hidden">
        <AlignJustify :size="15" />
      </ToggleGroupItem>
    </ToggleGroup>
    <Separator orientation="vertical" class="h-8 mx-4" />
    <ToggleGroup type="single" v-model="textTransform" class="flex items-center gap-1">
      <ToggleGroupItem variant="outline" size="sm" value="uppercase" aria-label="uppercase" class="data-[state=on]:bg-card data-[state=on]:text-primary">
        <CaseUpper :size="15" />
      </ToggleGroupItem>
      <ToggleGroupItem variant="outline" size="sm" value="lowercase" aria-label="lowercase" class="data-[state=on]:bg-card data-[state=on]:text-primary">
        <CaseLower :size="15" />
      </ToggleGroupItem>
    </ToggleGroup>
    <Separator orientation="vertical" class="h-8 mx-4" />
    <div class="flex items-center gap-2">
      <PopoverRoot>
        <PopoverTrigger as-child>
          <Button size="icon" variant="outline" aria-label="letter-spacing" class="data-[state=open]:bg-card">
            <WholeWord :size="15" />
          </Button>
        </PopoverTrigger>
        <PopoverContent @open-auto-focus.prevent class="pt-2 pb-3 px-3" align="center">
          <Label class="text-xs font-medium">Letter Spacing</Label>
          <div class="flex items-center justify-between gap-4">
            <SliderInput :value="charSpacing" :min="0" :max="100" :step="1" :onChange="(value) => charSpacing = value"/>
          </div>
        </PopoverContent>
      </PopoverRoot>
      <PopoverRoot>
        <PopoverTrigger as-child>
          <Button size="icon" variant="outline" aria-label="line-height" class="data-[state=open]:bg-card">
            <ArrowDownZA :size="15" />
          </Button>
        </PopoverTrigger>
        <PopoverContent @open-auto-focus.prevent class="pt-2 pb-3 px-3" align="center">
          <Label class="text-xs font-medium">Line Height</Label>
          <div class="flex items-center justify-between gap-4">
            <SliderInput :value="lineHeight" :min="0.5" :max="2.5" :step="0.02" :onChange="(value) => lineHeight = value"/>
          </div>
        </PopoverContent>
      </PopoverRoot>
    </div>
    <Separator orientation="vertical" class="h-8 mx-4" />
    <ToolbarFillOption />
    <Separator orientation="vertical" class="h-8 mx-4" />
    <ToolbarStrokeOption />
    <Separator orientation="vertical" class="h-8 mx-4" />
    <ToolbarOpacityOption />
    <Separator orientation="vertical" class="h-8 mr-4" />
    <ToolbarTimelineOption />
  </div>
</template>