<script setup lang="ts">
import { computed } from 'vue';
import { useMutation } from '@tanstack/vue-query';

import Skeleton from '@/components/ui/skeleton.vue';

import { useEditorStore } from '@/store/editor';
import { useFetchVideoTemplates } from '@/api/assets';

const editor = useEditorStore();

const query = useFetchVideoTemplates({ limit: 50, is_published: editor.mode === "adapter" });

const loadTemplate = (template: any, mode: string) => {
  editor.loadTemplate(template, mode);
};
</script>

<template>
  <div class="px-3 grid grid-cols-2 gap-4 relative">
    <template v-if="!query.data || !query.data.pages.flat().length">
      <Skeleton v-for="(_, index) in 6" :key="index" class="w-full aspect-square rounded-md" />
      <span class="text-xs font-semibold text-foreground/60 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 line-clamp-1">Coming Soon</span>
    </template>
    <template v-else>
      <button v-for="template in query.data.pages.flat()" :key="template.id" class="w-full aspect-square rounded-md overflow-hidden group border" @click="loadTemplate(template, 'replace')">
        <img :src="template.pages[0].thumbnail" :alt="template.name" class="group-hover:scale-110 transition-transform" />
      </button>
    </template>
  </div>
</template>