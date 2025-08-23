<script setup lang="ts">
import { computed } from 'vue';
import { Search, Close as X } from '@icon-park/vue-next';

import { fonts } from '@/constants/fonts';

import { useEditorStore } from '@/store/editor';
import { useCanvasStore } from '@/store/canvas';
import { storeToRefs } from 'pinia';

import FontItem from './FontItem.vue';

const editor = useEditorStore();
const canvasStore = useCanvasStore();
const { canvas, selectionActive: selected } = storeToRefs(canvasStore);

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
      <el-button plain circle class="bg-card h-7 w-7 ml-auto" @click="editor.setActiveSidebarRight(null)">
        <X :size="15" />
      </el-button>
    </div>
    <section class="sidebar-container">
      <div class="px-3 py-4">
        <div class="relative">
          <el-input placeholder="Search..." class="text-xs" >
            <template #prefix>
              <Search :size="15" />
            </template>
          </el-input>
        </div>
      </div>
      <div class="px-3 pb-4 flex flex-col gap-1">
        <FontItem v-for="font in fonts" :key="font.family" :font="font" :selected="isFontSelected(font)" @click="handleChangeFontFamily(font)" />
      </div>
    </section>
  </div>
</template>
