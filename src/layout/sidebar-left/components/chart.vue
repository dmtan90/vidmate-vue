<script setup lang="ts">
import { computed, ref } from 'vue';

import { Search, X } from 'lucide-vue-next';

import Button from '@/components/ui/button.vue';
import Input from '@/components/ui/input.vue';

import { useEditorStore } from '@/store/editor';

import bar from '@/assets/editor/charts/bar.svg';

const editor = useEditorStore();

const addChart = (type: string) => {
  editor.canvas.chart.add(type);
};
</script>

<template>
  <div class="h-full w-full">
    <div class="flex items-center justify-between h-14 border-b px-4">
      <h2 class="font-semibold">Chart</h2>
      <Button size="icon" variant="outline" class="bg-card h-7 w-7" @click="editor.setActiveSidebarLeft(null)">
        <X :size="16" />
      </Button>
    </div>
    <section class="sidebar-container pb-4">
      <div class="px-3 pt-4 pb-6">
        <div class="relative">
          <Input placeholder="Search..." class="text-xs pl-8" />
          <Search :size="15" class="absolute top-1/2 -translate-y-1/2 left-2.5 text-foreground/60" />
        </div>
      </div>
      <div class="px-3 flex flex-col gap-6">
        <div class="flex flex-col gap-4">
          <h4 class="text-xs font-semibold line-clamp-1">Basic Charts</h4>
          <div class="grid grid-cols-3 gap-3">
            <div class="flex flex-col gap-2 items-center">
              <button
                @click="addChart('bar')"
                class="group shrink-0 w-full aspect-square border flex items-center justify-center overflow-hidden rounded-lg p-2 text-gray-800/80 dark:text-gray-100/80 transition-colors shadow-sm hover:bg-card hover:text-gray-800 dark:hover:text-gray-100"
              >
                <img :src="bar" alt="bar-chart" />
              </button>
              <span class="text-xxs text-center font-medium w-20 px-1 mx-auto whitespace-nowrap overflow-hidden text-ellipsis">Bar Chart</span>
            </div>
            <div class="flex flex-col gap-2 items-center">
              <button
                @click="addChart('line')"
                class="group shrink-0 w-full aspect-square border flex items-center justify-center overflow-hidden rounded-lg p-2 text-gray-800/80 dark:text-gray-100/80 transition-colors shadow-sm hover:bg-card hover:text-gray-800 dark:hover:text-gray-100"
              >
                <img :src="bar" alt="line-chart" />
              </button>
              <span class="text-xxs text-center font-medium w-20 px-1 mx-auto whitespace-nowrap overflow-hidden text-ellipsis">Line Chart</span>
            </div>
            <div class="flex flex-col gap-2 items-center">
              <button
                @click="addChart('pie')"
                class="group shrink-0 w-full aspect-square border flex items-center justify-center overflow-hidden rounded-lg p-2 text-gray-800/80 dark:text-gray-100/80 transition-colors shadow-sm hover:bg-card hover:text-gray-800 dark:hover:text-gray-100"
              >
                <img :src="bar" alt="pie-chart" />
              </button>
              <span class="text-xxs text-center font-medium w-20 px-1 mx-auto whitespace-nowrap overflow-hidden text-ellipsis">Pie Chart</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>