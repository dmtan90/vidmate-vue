<script setup lang="ts">
import { computed, ref, watch, onUnmounted } from 'vue';
import { X } from 'lucide-vue-next';

import Button from '@/components/ui/button.vue';
import Skeleton from '@/components/ui/skeleton.vue';
import Breadcrumb from '@/components/ui/breadcrumb.vue';
import BreadcrumbItem from '@/components/ui/breadcrumb-item.vue';
import BreadcrumbList from '@/components/ui/breadcrumb-list.vue';
import BreadcrumbSeparator from '@/components/ui/breadcrumb-separator.vue';
import SceneElement from './SceneElement.vue';
import { useEditorStore } from '@/store/editor';
import { useCanvasStore } from '@/store/canvas';
import { storeToRefs } from 'pinia';
import { abstract, basic, frames } from '@/constants/elements';
import { propertiesToInclude } from '@/fabric/constants';
import { cn } from '@/lib/utils';

import ExpandedGridView from './ExpandedGridView.vue';

const editor = useEditorStore();
const canvasStore = useCanvasStore();
const { canvas, selectionActive: selected, instance, elements } = storeToRefs(canvasStore);

// const selected = computed(() => editor.canvas.selection.active);

const clipMask = ref<string | undefined>(undefined);
const expanded = ref<false | string>(false);

watch(selected, (newSelected) => {
  if (!newSelected?.clipPath) {
    clipMask.value = undefined;
  } else {
    const clipPath = instance.value?.getItemByName(newSelected.clipPath.name);
    if (clipPath) {
      clipPath.clone((clone: fabric.Object) => {
        clone.set({ visible: true, opacity: 1 });
        clipMask.value = clone.toDataURL({ format: "image/webp" });
      }, propertiesToInclude);
    } else {
      clipMask.value = undefined;
    }
  }
}, { immediate: true });

const scene = computed(() => {
  return elements.value.filter((element) => element.name !== selected.value?.name);
});

</script>

<template>
  <div class="h-full w-full">
    <div class="flex items-center h-14 border-b px-4 gap-2.5">
      <h2 class="font-semibold">Clip Mask</h2>
      <Button size="icon" variant="outline" class="bg-card h-7 w-7 ml-auto" @click="editor.setActiveSidebarRight(null)">
        <X :size="15" />
      </Button>
    </div>
    <template v-if="!expanded">
      <div class="p-4 flex flex-col gap-4 sidebar-container">
        <div v-if="clipMask" class="flex flex-col gap-3 pb-2">
          <div class="bg-transparent-pattern p-6">
            <img :src="clipMask" class="w-full h-auto" />
          </div>
          <Button size="sm" variant="outline" class="w-full" @click="editor.canvas.clipper.removeClipMaskFromActiveObject()">
            Remove clip mask
          </Button>
        </div>
        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between gap-4">
            <h4 class="text-xs font-semibold line-clamp-1">Basic Shapes</h4>
            <Button size="sm" variant="link" class="text-primary font-medium line-clamp-1" @click="expanded = 'basic'">
              See All
            </Button>
          </div>
          <div class="flex gap-2.5 items-center overflow-x-scroll scrollbar-hidden">
            <button
              v-for="({ name, path, klass, params }) in basic.slice(0, 10)"
              :key="name"
              @click="editor.canvas.clipper.clipActiveObjectFromBasicShape(klass, params)"
              class="group shrink-0 h-16 w-16 border flex items-center justify-center overflow-hidden rounded-md p-2 text-gray-800/80 dark:text-gray-100/80 transition-colors shadow-sm hover:bg-card hover:text-gray-800 dark:hover:text-gray-100"
            >
              <svg viewBox="0 0 48 48" :aria-label="name" fill="currentColor" class="h-full w-full transition-transform group-hover:scale-105">
                <path :d="path" class="h-full" />
              </svg>
            </button>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between gap-4">
            <h4 class="text-xs font-semibold line-clamp-1">Abstract Shapes</h4>
            <Button size="sm" variant="link" class="text-primary font-medium line-clamp-1" @click="expanded = 'abstract'">
              See All
            </Button>
          </div>
          <div class="flex gap-2.5 items-center overflow-x-scroll relative scrollbar-hidden">
            <button
              v-for="({ name, path, height, width, id }) in abstract.slice(0, 10)"
              :key="id"
              @click="editor.canvas.clipper.clipActiveObjectFromAbstractShape(path, name)"
              class="group shrink-0 h-16 w-16 border flex items-center justify-center overflow-hidden rounded-md p-2 text-gray-800/80 dark:text-gray-100/80 transition-colors shadow-sm hover:bg-card hover:text-gray-800 dark:hover:text-gray-100"
            >
              <svg :viewBox="`0 0 ${width} ${height}`" :aria-label="name" fill="currentColor" class="h-full w-full transition-transform group-hover:scale-105">
                <path :d="path" class="h-full" />
              </svg>
            </button>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between gap-4">
            <h4 class="text-xs font-semibold line-clamp-1">Frames</h4>
            <Button size="sm" variant="link" class="text-primary font-medium line-clamp-1" @click="expanded = 'frames'">
              See All
            </Button>
          </div>
          <div class="flex gap-2.5 items-center overflow-x-scroll relative scrollbar-hidden">
            <button
              v-for="({ name, path, height, width, id }) in frames.slice(0, 10)"
              :key="id"
              @click="editor.canvas.clipper.clipActiveObjectFromAbstractShape(path, name)"
              class="group shrink-0 h-16 w-16 border flex items-center justify-center overflow-hidden rounded-md p-2 text-gray-800/80 dark:text-gray-100/80 transition-colors shadow-sm hover:bg-card hover:text-gray-800 dark:hover:text-gray-100"
            >
              <svg :viewBox="`0 0 ${width} ${height}`" :aria-label="name" fill="currentColor" class="h-full w-full transition-transform group-hover:scale-105">
                <path :d="path" class="h-full" />
              </svg>
            </button>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between gap-4">
            <h4 class="text-xs font-semibold line-clamp-1">Scene Elements</h4>
            <Button size="sm" variant="link" class="text-primary font-medium line-clamp-1" @click="expanded = 'scene'">
              See All
            </Button>
          </div>
          <div class="flex gap-2.5 items-center overflow-x-scroll scrollbar-hidden relative">
            <template v-if="scene.length">
              <SceneElement v-for="element in scene.slice(0, 10)" :key="element.name" :element="element" />
            </template>
            <template v-else>
              <Skeleton v-for="(_, index) in 3" :key="index" class="h-16 flex-1 rounded-md" />
              <span class="text-xs font-semibold text-foreground/60 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 leading-none">No Elements</span>
            </template>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="px-3 pt-4 flex flex-col gap-4 sidebar-container">
        <Breadcrumb>
          <BreadcrumbList class="sm:gap-1 gap-1">
            <BreadcrumbItem>
              <Button variant="ghost" size="sm" class="text-xs h-6 px-2 text-foreground/30 hover:text-foreground/40" @click="expanded = false">
                Shapes
              </Button>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Button disabled variant="ghost" size="sm" class="text-xs h-6 px-2 capitalize disabled:opacity-100">
                {{ expanded }}
              </Button>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div class="grid grid-cols-3 gap-2.5 relative">
          <ExpandedGridView :match="expanded" :scene="scene" />
        </div>
      </div>
    </template>
  </div>
</template>