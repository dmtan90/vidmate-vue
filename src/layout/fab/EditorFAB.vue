<script setup lang="ts">
import { computed } from 'vue';
import { Plus, Trash } from 'lucide-vue-next';

import Button from '@/components/ui/button.vue';
import TabsRoot from '@/components/ui/tabs-root.vue';
import TabsList from '@/components/ui/tabs-list.vue';
import TabsTrigger from '@/components/ui/tabs-trigger.vue';

import { useEditorStore } from '@/store/editor';
import { cn } from '@/lib/utils';

const editor = useEditorStore();

const handleAddPage = () => {
  editor.addPage();
};

const handleDeleteActivePage = () => {
  editor.deleteActivePage();
};

const handleChangeActivePage = (value: string) => {
  editor.onChangeActivePage(parseInt(value));
};

const isPlaying = computed(() => editor.canvas.timeline?.playing);

</script>

<template>
  <div :class="cn('absolute bottom-3 left-3 sm:bottom-6 sm:left-6 flex-row-reverse items-center gap-2.5 z-20', isPlaying ? 'pointer-events-none opacity-50' : 'pointer-events-auto opacity-100')">
    <TabsRoot :model-value="String(editor.page)" @update:model-value="handleChangeActivePage">
      <TabsList class="shadow-sm bg-card dark:bg-muted">
        <TabsTrigger v-for="(_, index) in editor.pages" :key="index" :value="String(index)" class="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-none text-xs h-full px-4">
          Page {{ index + 1 }}
        </TabsTrigger>
      </TabsList>
    </TabsRoot>
    <Button
      size="default"
      @click="handleAddPage"
      :disabled="editor.pages.length > 3"
      class="text-xs rounded-lg shadow-sm gap-1.5 border bg-card dark:bg-primary border-primary text-primary dark:text-black hover:bg-primary dark:hover:bg-blue-primary/90 hover:text-white"
    >
      <Plus :size="15" />
      <span class="font-medium">Add</span>
    </Button>
    <Button
      size="icon"
      :disabled="editor.pages.length === 1"
      @click="handleDeleteActivePage"
      class="h-9 w-9 shadow-sm border bg-card border-destructive dark:bg-destructive text-destructive dark:text-white hover:bg-destructive dark:hover:bg-blue-destructive/90 hover:text-white"
    >
      <Trash :size="15" />
    </Button>
  </div>
</template>
