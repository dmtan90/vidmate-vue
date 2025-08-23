<script setup lang="ts">
import { computed, ref } from 'vue';
import { Eye, EyesClose as EyeOff, Close as X } from '@icon-park/vue-next';

import Label from '@/components/ui/label.vue';
import Toggle from '@/components/ui/toggle.vue';

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
  console.log("handleModifyAdjustment", adjustment, intensity);
  effects.value.applyAdjustmentToActiveImage(adjustment.filter(intensity), adjustment.name, intensity);
};

const activeTab = ref('effects');

const options = [
  {
    value: 'effects',
    label: 'Effects'
  },
  {
    value: 'adjustments',
    label: 'Adjustments'
  }
];

</script>

<template>
  <div class="h-full w-full">
    <div class="flex items-center h-14 border-b px-4 gap-2.5">
      <h2 class="font-semibold">Filters</h2>
      <el-button plain circle class="bg-card h-7 w-7 ml-auto" @click="editor.setActiveSidebarRight(null)">
        <X :size="15" />
      </el-button>
    </div>
    <section class="sidebar-container px-4 py-4">
      <el-segmented v-model="activeTab" :options="options" block style="--el-border-radius-base: 20px;"/>
      <div class="flex flex-col gap-3 pt-3.5">
        <template v-if="activeTab == 'effects'">
          <FilterItem v-for="filter in filters" :key="filter.name" :filter="filter" :selected="selected" @change="(intensity) => handleModifyFilter(filter, intensity)" @click="handleToggleFilter(filter)" />
        </template>
        <template v-else>
          <AdjustmentItem
            v-for="adjustment in adjustments"
            :key="adjustment.name"
            :adjustment="adjustment"
            :selected="selected"
            @change="(intensity) => handleModifyAdjustment(adjustment, intensity)"
            @toggle="(active) => handleToggleAdjustment(adjustment, active)"
          />
        </template>
      </div>
      <!--<el-tabs v-model="activeTab" type="card" stretch>
        <el-tab-pane label="Effects" name="effects">
          <div class="flex flex-col gap-3 pt-3.5">
            <FilterItem v-for="filter in filters" :key="filter.name" :filter="filter" :selected="selected" @change="(intensity) => handleModifyFilter(filter, intensity)" @click="handleToggleFilter(filter)" />
          </div>
        </el-tab-pane>
        <el-tab-pane label="Adjustments" name="adjustments">
          <div class="flex flex-col gap-4 pt-5">
            <AdjustmentItem
              v-for="adjustment in adjustments"
              :key="adjustment.name"
              :adjustment="adjustment"
              :selected="selected"
              @change="(intensity) => handleModifyAdjustment(adjustment, intensity)"
              @toggle="(active) => handleToggleAdjustment(adjustment, active)"
            />
          </div>
        </el-tab-pane>
      </el-tabs>-->
    </section>
  </div>
</template>
