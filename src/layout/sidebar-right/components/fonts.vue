<script setup lang="ts">
import { computed } from 'vue';
import { Search, X } from 'lucide-vue-next';

import Button from '@/components/ui/button.vue';
import Input from '@/components/ui/input.vue';

import { fonts } from '@/constants/fonts';

import { useEditorStore } from '@/store/editor';
import { useCanvasStore } from '@/store/canvas';
import { storeToRefs } from 'pinia';

import FontItem from './FontItem.vue';

const editor = useEditorStore();
const canvasStore = useCanvasStore();
const { canvas, selectionActive: selected } = storeToRefs(canvasStore);
// const selected = computed(() => editor.canvas.selection.active);

const isFontSelected = (font: any) => {
  return selected.value?.fontFamily?.toLowerCase() === font.family.toLowerCase();
};

const handleChangeFontFamily = (font: any) => {
  canvas.value.onChangeActiveTextboxFontFamily(font.family, font);
};

</script>

<template>
  <div class="h-full w-full">
    <div class="flex items-center h-14 border-b px-4 gap-2.5">
      <h2 class="font-semibold">Fonts</h2>
      <Button size="icon" variant="outline" class="bg-card h-7 w-7 ml-auto" @click="editor.setActiveSidebarRight(null)">
        <X :size="15" />
      </Button>
    </div>
    <section class="sidebar-container">
      <div class="px-3 py-4">
        <div class="relative">
          <Input placeholder="Search..." class="text-xs pl-8" />
          <Search :size="15" class="absolute top-1/2 -translate-y-1/2 left-2.5 text-foreground/60" />
        </div>
      </div>
      <div class="px-3 pb-4 flex flex-col gap-1">
        <FontItem v-for="font in fonts" :key="font.family" :font="font" :selected="isFontSelected(font)" @click="handleChangeFontFamily(font)" />
      </div>
    </section>
  </div>
</template>