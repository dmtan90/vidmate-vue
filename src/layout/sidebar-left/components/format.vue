<script setup lang="ts">
import { computed, ref } from 'vue';

import { Search, X } from 'lucide-vue-next';

import Button from '@/components/ui/button.vue';
import Input from '@/components/ui/input.vue';

import { formats } from '@/constants/editor';
import { useEditorStore } from '@/store/editor';

const editor = useEditorStore();

const resizeArtboard = (dimensions: { width: number; height: number }) => {
  editor.canvas.workspace.resizeArtboard(dimensions);
};

</script>

<template>
  <div class="h-full w-full">
    <div class="flex items-center justify-between h-14 border-b px-4">
      <h2 class="font-semibold">Formats</h2>
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
      <div class="px-4 grid grid-cols-3 gap-4 relative">
        <div v-for="format in formats" :key="format.name" class="flex flex-col gap-2">
          <button
            @click="resizeArtboard(format.dimensions)"
            class="group shrink-0 border flex items-center justify-center overflow-hidden rounded-md shadow-sm transition-colors hover:bg-card p-1.5"
          >
            <img :src="format.preview" class="object-contain h-full w-full" />
          </button>
          <span class="text-xxs text-foreground/60 text-center">{{ format.name }}</span>
        </div>
      </div>
    </section>
  </div>
</template>