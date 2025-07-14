<script setup lang="ts">
import { computed, ref } from 'vue';

import { Search, X, Plus } from 'lucide-vue-next';

import Button from '@/components/ui/button.vue';
import Input from '@/components/ui/input.vue';
import TabsRoot from '@/components/ui/tabs-root.vue';
import TabsContent from '@/components/ui/tabs-content.vue';
import TabsList from '@/components/ui/tabs-list.vue';
import TabsTrigger from '@/components/ui/tabs-trigger.vue';

import { useEditorStore } from '@/store/editor';

import CloudTemplateContent from './CloudTemplateContent.vue';
import LocalTemplateContent from './LocalTemplateContent.vue';

const editor = useEditorStore();

</script>

<template>
  <div class="h-full w-full">
    <div class="flex items-center justify-between h-14 border-b px-4">
      <h2 class="font-semibold">Scenes</h2>
      <Button
        @click=""
        class="text-xs h-7 w-7 rounded-md shadow-sm gap-1.5 border bg-card dark:bg-primary border-primary text-primary dark:text-black hover:bg-primary dark:hover:bg-blue-primary/90 hover:text-white"
      >
        <Plus :size="15" />
        <span>Add</span>
      </Button>
      <Button size="icon" variant="outline" class="bg-card h-7 w-7" @click="editor.setActiveSidebarLeft(null)">
        <X :size="16" />
      </Button>
    </div>
    <section class="sidebar-container pb-4">
      <div class="grid grid-cols-1 gap-x-2 gap-y-2 px-8">
        <Button as-child size="sm" variant="outline" class="h-7 bg-card gap-1 pl-2 w-full">
          <label>
            <Plus :size="14" />
            <span>Load JSON</span>
          </label>
        </Button>
        <Button as-child size="sm" variant="outline" class="h-7 bg-card gap-1 pl-2 w-full opacity-50 pointer-events-none">
          <label>
            <Plus :size="14" />
            <span>Load PSD</span>
          </label>
        </Button>
      </div>
    </section>
  </div>
</template>