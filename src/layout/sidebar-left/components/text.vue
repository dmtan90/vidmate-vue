<script setup lang="ts">
import { Search, X } from 'lucide-vue-next';

import Button from '@/components/ui/button.vue';
import Input from '@/components/ui/input.vue';

import { useEditorStore } from '@/store/editor';
import { inter } from '@/constants/fonts';

const editor = useEditorStore();

const handleAddTitle = () => {
  editor.canvas.onAddText("Your title goes here", inter, 64, 700);
};

const handleAddHeading = () => {
  editor.canvas.onAddText("Your heading goes here", inter, 42, 700);
};

const handleAddParagraph = () => {
  editor.canvas.onAddText("Your paragraph goes here", inter, 24, 400);
};
</script>

<template>
  <div class="h-full w-full">
    <div class="flex items-center justify-between h-14 border-b px-4">
      <h2 class="font-semibold">Text</h2>
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
          <h4 class="text-xs font-semibold line-clamp-1">Basic Texts</h4>
          <div class="flex flex-col gap-3">
            <button @click="handleAddTitle" class="h-16 border flex items-center justify-center overflow-hidden rounded-md px-3 text-2xl font-semibold text-center transition-colors shadow-sm hover:bg-card">
              <span class="line-clamp-1">Add a Title</span>
            </button>
            <button @click="handleAddHeading" class="h-16 border flex items-center justify-center overflow-hidden rounded-md px-3 text-lg font-semibold text-center transition-colors shadow-sm hover:bg-card">
              <span class="line-clamp-1">Add a Heading</span>
            </button>
            <button @click="handleAddParagraph" class="h-16 border flex items-center justify-center overflow-hidden rounded-md px-3 text-sm font-normal text-center transition-colors shadow-sm hover:bg-card">
              <span class="line-clamp-1">Add a Paragraph</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>