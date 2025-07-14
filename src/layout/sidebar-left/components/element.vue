<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue';

import { Search, X } from 'lucide-vue-next';

import Breadcrumb from '@/components/ui/breadcrumb.vue';
import BreadcrumbItem from '@/components/ui/breadcrumb-item.vue';
import BreadcrumbList from '@/components/ui/breadcrumb-list.vue';
import BreadcrumbSeparator from '@/components/ui/breadcrumb-separator.vue';
import Button from '@/components/ui/button.vue';
import Input from '@/components/ui/input.vue';

import { abstract, basic, frames, lines } from '@/constants/elements';
import { useEditorStore } from '@/store/editor';
import { cn } from '@/lib/utils';

import ExpandedGridView from './ExpandedGridView.vue';

const editor = useEditorStore();

const expanded = ref<false | string>(false);

const onAddBasicShape = (klass: string, params: any) => {
  editor.canvas.onAddBasicShape(klass, params);
};

const onAddAbstractShape = (path: string, name: string) => {
  editor.canvas.onAddAbstractShape(path, name);
};

const onAddLine = (points: number[], name: string) => {
  editor.canvas.onAddLine(points, name);
};

</script>

<template>
  <div class="h-full w-full">
    <div class="flex items-center justify-between h-14 border-b px-4">
      <h2 class="font-semibold">Elements</h2>
      <Button size="icon" variant="outline" class="bg-card h-7 w-7" @click="editor.setActiveSidebarLeft(null)">
        <X :size="16" />
      </Button>
    </div>
    <section class="sidebar-container pb-4">
      <div :class="cn('px-3 pt-4 flex flex-col gap-2.5 border-b', expanded ? 'border-b pb-2.5' : 'pb-6 border-b-0')">
        <div class="relative">
          <Input placeholder="Search..." class="text-xs pl-8" />
          <Search :size="15" class="absolute top-1/2 -translate-y-1/2 left-2.5 text-foreground/60" />
        </div>
        <template v-if="expanded">
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
        </template>
      </div>
      <template v-if="!expanded">
        <div class="px-3 flex flex-col gap-6">
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
                @click="onAddBasicShape(klass, params)"
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
                @click="onAddAbstractShape(path, name)"
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
                @click="onAddAbstractShape(path, name)"
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
              <h4 class="text-xs font-semibold line-clamp-1">Lines</h4>
              <Button size="sm" variant="link" class="text-primary font-medium line-clamp-1">
                See All
              </Button>
            </div>
            <div class="flex gap-2.5 items-center overflow-x-scroll relative scrollbar-hidden">
              <button
                v-for="({ name, path, points }) in lines"
                :key="name"
                @click="onAddLine(points, name)"
                class="group shrink-0 h-16 w-16 border flex items-center justify-center overflow-hidden rounded-md p-2 text-gray-800/80 dark:text-gray-100/80 transition-colors shadow-sm hover:bg-card hover:text-gray-800 dark:hover:text-gray-100"
              >
                <svg viewBox="0 0 48 48" :aria-label="name" fill="currentColor" class="h-full w-full transition-transform group-hover:scale-105">
                  <path :d="path" class="h-full" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="px-3 grid grid-cols-3 gap-2.5 pt-4">
          <ExpandedGridView :match="expanded" />
        </div>
      </template>
    </section>
  </div>
</template>
