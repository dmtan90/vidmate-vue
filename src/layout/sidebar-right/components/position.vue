<script setup lang="ts">
import { computed, ref, watch, reactive, onMounted } from 'vue';
import { PreviewOpen as Eye, PreviewCloseOne as EyeOff, ColorFilter as Pipette, Close as X } from '@icon-park/vue-next';
import { toast } from 'vue-sonner';

import GradientSlider from '@/components/slider/gradient.vue';
import { ChromePicker, ColorResult, tinycolor } from 'vue-color';

import { darkHexCodes, lightHexCodes, pastelHexCodes } from '@/constants/editor';

import { useEditorStore } from '@/store/editor';
import { useCanvasStore } from '@/store/canvas';
import { storeToRefs } from "pinia";
import { defaultFill, defaultGradient } from '@/fabric/constants';
import { cn, createInstance } from '@/lib/utils';
import { useMeasure } from '@/hooks/use-measure';
import { FabricUtils } from '@/fabric/utils';
import Arrange from './arrange.vue';
import Layers from './layers.vue';

const editor = useEditorStore();
const canvasStore = useCanvasStore();
const { canvas, selectionActive: selected } = storeToRefs(canvasStore);

watch(canvas, (value) => {
  console.log("canvas", value);
  // forceUpdate();
});

// const [containerRef, measure] = useMeasure();

const activeTab = ref('arrange');
onMounted(() => {
  activeTab.value = 'arrange';
  setTimeout(() => {
    activeTab.value = 'arrange';
  }, 100);
});

</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center h-14 border-b px-4 gap-2.5">
      <h2 class="font-semibold">Position</h2>
      <el-button circle :icon="X" class="ml-auto" @click="editor.setActiveSidebarRight(null)" />
    </div>
    <section class="flex flex-col sidebar-container px-4 py-4 overflow-hidden">
      <el-tabs v-model="activeTab" stretch class="h-full">
        <el-tab-pane label="Arrange" name="arrange">
          <Arrange />
        </el-tab-pane>
        <el-tab-pane label="Layers" name="layers">
          <Layers />
        </el-tab-pane>
      </el-tabs>
    </section>
  </div>
</template>

<style>
.sidebar-container {
  .el-tabs {
    .el-tab-pane{
      height: 100%;
    }
  }
}
</style>
