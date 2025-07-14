<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { upperFirst } from 'lodash';
import { X } from 'lucide-vue-next';
import Button from '@/components/ui/button.vue';
import TabsRoot from '@/components/ui/tabs-root.vue';
import TabsContent from '@/components/ui/tabs-content.vue';
import TabsList from '@/components/ui/tabs-list.vue';
import TabsTrigger from '@/components/ui/tabs-trigger.vue';

import { useEditorStore } from '@/store/editor';
import { useCanvasStore } from "@/store/canvas";
import { storeToRefs } from "pinia";

import { defaultSpringConfig, easings, entry, exit, scene } from '@/constants/animations';

import Animations from './Animations.vue';

const editor = useEditorStore();
const canvasStore = useCanvasStore();
const { canvas, selectionActive: selected } = storeToRefs(canvasStore);

// const canvas = editor.canvas;
// const selected = ref(editor.canvas?.selection?.active ?? null);
// watch(active, (value) => {
//   console.log(active);
//   // selected.value = editor.canvas?.selection?.active ?? null;
// });
// const selected = computed(() => editor.canvas.selection.active);

</script>

<template>
  <div class="h-full w-full @container">
    <div class="flex items-center h-14 border-b px-4 gap-2.5">
      <h2 class="font-semibold">Animations</h2>
      <Button size="icon" variant="outline" class="bg-card h-7 w-7 ml-auto" @click="editor.setActiveSidebarRight(null)">
        <X :size="15" />
      </Button>
    </div>
    <section class="sidebar-container px-4 py-4">
      <TabsRoot default-value="in">
        <TabsList class="w-full grid grid-cols-3">
          <TabsTrigger value="in" class="text-xs h-full">
            In
          </TabsTrigger>
          <TabsTrigger value="scene" class="text-xs h-full">
            Scene
          </TabsTrigger>
          <TabsTrigger value="out" class="text-xs h-full">
            Out
          </TabsTrigger>
        </TabsList>
        <TabsContent value="in" class="mt-0 pt-5">
          <Animations :animations="entry" :selected="selected" type="in" />
        </TabsContent>
        <TabsContent value="scene" class="mt-0 pt-5">
          <Animations :animations="scene" :selected="selected" type="scene" />
        </TabsContent>
        <TabsContent value="out" class="mt-0 pt-5">
          <Animations :animations="exit" :selected="selected" type="out" />
        </TabsContent>
      </TabsRoot>
    </section>
  </div>
</template>
