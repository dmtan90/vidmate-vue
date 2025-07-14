<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { X } from 'lucide-vue-next';

import Button from '@/components/ui/button.vue';
import { useEditorStore } from '@/store/editor';
import { useCanvasStore } from '@/store/canvas';
import { storeToRefs } from "pinia";

import AIPluginItems from './AIPluginItems.vue';
import AIPluginItem from './AIPluginItem.vue';

interface AISelectPluginProps {
  plugin: string;
  onSelectPlugin: (plugin: string, label: string) => void;
}

const pluginState = (selection?: any) => {
  if (selection?.type === "textbox" && selection.meta?.placeholder && selection.meta?.label) return { label: `Magic Write`, value: "magic-write" };
  return { label: "", value: "" };
};

const editor = useEditorStore();
const canvasStore = useCanvasStore();
const { canvas, selectionActive: selected } = storeToRefs(canvasStore);

// const selected = computed(() => editor.canvas.selection.active);

const label = ref(pluginState(selected.value).label);
const plugin = ref(pluginState(selected.value).value);

watch(selected, (newSelected) => {
  const state = pluginState(newSelected);
  label.value = state.label;
  plugin.value = state.value;
});

const handleSelectPlugin = (selectedPlugin: string, selectedLabel: string) => {
  label.value = selectedLabel;
  plugin.value = selectedPlugin;
};

const handleClosePlugin = () => {
  plugin.value = "";
  label.value = "";
};

</script>

<template>
  <div class="h-full w-full">
    <template v-if="!plugin">
      <div class="flex items-center h-14 border-b px-4 gap-2.5">
        <h2 class="font-semibold">AI Magic</h2>
        <Button size="icon" variant="outline" class="bg-card h-7 w-7 ml-auto" @click="editor.setActiveSidebarRight(null)">
          <X :size="15" />
        </Button>
      </div>
      <section class="sidebar-container px-4 py-4">
        <AIPluginItems @on-select-plugin="handleSelectPlugin" />
      </section>
    </template>
    <template v-else>
      <div class="flex items-center h-14 border-b px-4 gap-2.5">
        <h2 class="font-semibold">{{ label }}</h2>
        <Button size="icon" variant="outline" class="bg-card h-7 w-7 ml-auto" @click="handleClosePlugin">
          <X :size="15" />
        </Button>
      </div>
      <section class="sidebar-container px-4 py-4">
        <AIPluginItem :plugin="plugin" @on-select-plugin="handleSelectPlugin" />
      </section>
    </template>
  </div>
</template>