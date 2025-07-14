<script setup lang="ts">
import { useEditorStore } from '@/store/editor';
import { abstract, basic, frames } from '@/constants/elements';

const props = defineProps<{ match: string }>();

const editor = useEditorStore();

const onAddBasicShape = (klass: string, params: any) => {
  editor.canvas.onAddBasicShape(klass, params);
};

const onAddAbstractShape = (path: string, name: string) => {
  editor.canvas.onAddAbstractShape(path, name);
};
</script>

<template>
  <template v-if="match === 'basic'">
    <button
      v-for="({ name, path, klass, params }) in basic"
      :key="name"
      @click="onAddBasicShape(klass, params)"
      class="group shrink-0 w-full aspect-square border flex items-center justify-center overflow-hidden rounded-lg p-2 text-gray-800/80 dark:text-gray-100/80 transition-colors shadow-sm hover:bg-card hover:text-gray-800 dark:hover:text-gray-100"
    >
      <svg viewBox="0 0 48 48" :aria-label="name" fill="currentColor" class="h-full w-full transition-transform group-hover:scale-105">
        <path :d="path" class="h-full" />
      </svg>
    </button>
  </template>

  <template v-else-if="match === 'abstract'">
    <button
      v-for="({ name, path, height, width, id }) in abstract"
      :key="id"
      @click="onAddAbstractShape(path, name)"
      class="group shrink-0 w-full aspect-square border flex items-center justify-center overflow-hidden rounded-lg p-2 text-gray-800/80 dark:text-gray-100/80 transition-colors shadow-sm hover:bg-card hover:text-gray-800 dark:hover:text-gray-100"
    >
      <svg :viewBox="`0 0 ${width} ${height}`" :aria-label="name" fill="currentColor" class="h-full w-full transition-transform group-hover:scale-105">
        <path :d="path" class="h-full" />
      </svg>
    </button>
  </template>

  <template v-else-if="match === 'frames'">
    <button
      v-for="({ name, path, height, width, id }) in frames"
      :key="id"
      @click="onAddAbstractShape(path, name)"
      class="group shrink-0 w-full aspect-square border flex items-center justify-center overflow-hidden rounded-lg p-2 text-gray-800/80 dark:text-gray-100/80 transition-colors shadow-sm hover:bg-card hover:text-gray-800 dark:hover:text-gray-100"
    >
      <svg :viewBox="`0 0 ${width} ${height}`" :aria-label="name" fill="currentColor" class="h-full w-full transition-transform group-hover:scale-105">
        <path :d="path" class="h-full" />
      </svg>
    </button>
  </template>
</template>