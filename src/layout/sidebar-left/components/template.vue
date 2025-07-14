<script setup lang="ts">
import { computed, ref } from 'vue';

import { Search, X } from 'lucide-vue-next';

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
      <h2 class="font-semibold">Templates</h2>
      <Button size="icon" variant="outline" class="bg-card h-7 w-7" @click="editor.setActiveSidebarLeft(null)">
        <X :size="16" />
      </Button>
    </div>
    <section class="sidebar-container pb-4">
      <template v-if="editor.mode === 'creator'">
        <TabsRoot default-value="local">
          <div class="px-3 pt-4 pb-6 flex flex-col gap-4">
            <div class="relative">
              <Input placeholder="Search..." class="text-xs pl-8" />
              <Search :size="15" class="absolute top-1/2 -translate-y-1/2 left-2.5 text-foreground/60" />
            </div>
            <TabsList class="grid grid-cols-2">
              <TabsTrigger class="text-xs h-full" value="cloud">
                Cloud
              </TabsTrigger>
              <TabsTrigger class="text-xs h-full" value="local">
                Local
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="cloud" class="mt-0 flex flex-col gap-6">
            <CloudTemplateContent />
          </TabsContent>
          <TabsContent value="local" class="mt-0 flex flex-col gap-6">
            <LocalTemplateContent />
          </TabsContent>
        </TabsRoot>
      </template>

      <template v-else-if="editor.mode === 'adapter'">
        <div class="px-3 pt-4 pb-6 flex flex-col gap-4">
          <div class="relative">
            <Input placeholder="Search..." class="text-xs pl-8" />
            <Search :size="15" class="absolute top-1/2 -translate-y-1/2 left-2.5 text-foreground/60" />
          </div>
        </div>
        <CloudTemplateContent />
      </template>

      <template v-else>
        <div>Unknown editor mode</div>
      </template>
    </section>
  </div>
</template>