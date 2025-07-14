<script setup lang="ts">
import { computed } from 'vue';
import { Eye, EyeOff, X } from 'lucide-vue-next';

import Button from '@/components/ui/button.vue';
import Label from '@/components/ui/label.vue';
import Toggle from '@/components/ui/toggle.vue';
import TabsRoot from '@/components/ui/tabs-root.vue';
import TabsContent from '@/components/ui/tabs-content.vue';
import TabsList from '@/components/ui/tabs-list.vue';
import TabsTrigger from '@/components/ui/tabs-trigger.vue';

import { useEditorStore } from '@/store/editor';
import { useCanvasStore } from '@/store/canvas';
import { storeToRefs } from "pinia";
import { filters, adjustments } from '@/constants/filters';
import { cn } from '@/lib/utils';

import FilterItem from './FilterItem.vue';
import AdjustmentItem from './AdjustmentItem.vue';

const editor = useEditorStore();
const canvasStore = useCanvasStore();
const { canvas, selectionActive: selected, effects } = storeToRefs(canvasStore);
// const selected = computed(() => editor.canvas.selection.active);

const handleToggleFilter = (filter: any) => {
  if (selected.value?.effects?.name === filter.name) {
    effects.value.removeFilterFromActiveImage(filter.name);
  } else {
    effects.value.addFilterToActiveImage(filter.filter(50), filter.name, 50);
  }
};

const handleModifyFilter = (filter: any, intensity: number) => {
  effects.value.addFilterToActiveImage(filter.filter(intensity), filter.name, intensity);
};

const handleToggleAdjustment = (adjustment: any, active: boolean) => {
  if (active) {
    effects.value.applyAdjustmentToActiveImage(adjustment.filter(0), adjustment.name, 0);
  } else {
    effects.value.removeAdjustmentFromActiveImage(adjustment.name);
  }
};

const handleModifyAdjustment = (adjustment: any, intensity: number) => {
  effects.value.applyAdjustmentToActiveImage(adjustment.filter(intensity), adjustment.name, intensity);
};

</script>

<template>
  <div class="h-full w-full">
    <div class="flex items-center h-14 border-b px-4 gap-2.5">
      <h2 class="font-semibold">Filters</h2>
      <Button size="icon" variant="outline" class="bg-card h-7 w-7 ml-auto" @click="editor.setActiveSidebarRight(null)">
        <X :size="15" />
      </Button>
    </div>
    <section class="sidebar-container px-4 py-4">
      <TabsRoot default-value="effects">
        <TabsList class="w-full grid grid-cols-2">
          <TabsTrigger value="effects" class="text-xs h-full">
            Effects
          </TabsTrigger>
          <TabsTrigger value="adjustments" class="text-xs h-full">
            Adjustments
          </TabsTrigger>
        </TabsList>
        <TabsContent value="effects" class="mt-0 pt-3.5">
          <div class="flex flex-col gap-3">
            <FilterItem v-for="filter in filters" :key="filter.name" :filter="filter" :selected="selected" @change="(intensity) => handleModifyFilter(filter, intensity)" @click="handleToggleFilter(filter)" />
          </div>
        </TabsContent>
        <TabsContent value="adjustments" class="mt-0 pt-5">
          <div class="flex flex-col gap-4">
            <AdjustmentItem
              v-for="adjustment in adjustments"
              :key="adjustment.name"
              :adjustment="adjustment"
              :selected="selected"
              @change="(intensity) => handleModifyAdjustment(adjustment, intensity)"
              @toggle="(active) => handleToggleAdjustment(adjustment, active)"
            />
          </div>
        </TabsContent>
      </TabsRoot>
    </section>
  </div>
</template>