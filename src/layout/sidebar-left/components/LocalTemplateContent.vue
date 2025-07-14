<script setup lang="ts">
import { computed, ref } from 'vue';
import { useMutation } from '@tanstack/vue-query';
import { toast } from 'vue-sonner';

import { Plus } from 'lucide-vue-next';
import Button from '@/components/ui/button.vue';
import Skeleton from '@/components/ui/skeleton.vue';

import { useEditorStore } from '@/store/editor';
import { useMockStore } from '@/constants/mock';
import { createInstance, createPromise } from '@/lib/utils';
import type { EditorTemplate } from '@/types/editor';

const editor = useEditorStore();
const mock = useMockStore();

const loadTemplate = (template: EditorTemplate, mode: string) => {
  editor.loadTemplate(template, mode);
};

const loadJSON = useMutation({
  mutationFn: async (file: File) => {
    return createPromise<EditorTemplate | EditorTemplate[]>((resolve, reject) => {
      const reader = createInstance(FileReader);
      reader.addEventListener("load", async () => {
        if (!reader.result) return reject();
        resolve(JSON.parse(reader.result as string));
      });
      reader.addEventListener("error", () => {
        reject();
      });
      reader.readAsText(file);
    });
  },
  onSuccess: (template) => {
    if (Array.isArray(template)) {
      template.map((t) => mock.upload("template", t));
    } else {
      mock.upload("template", template);
      loadTemplate(template, "reset");
    }
  },
});

const handleLoadJSON = async (event: Event) => {
  const files = (event.target as HTMLInputElement).files;
  if (!files || !files.length) return;
  await loadJSON.mutateAsync(files[0]);
};
</script>

<template>
  <template>
    <div class="grid grid-cols-2 gap-x-4 gap-y-2 px-3">
      <Button as-child size="sm" variant="outline" class="h-7 bg-card gap-1 pl-2 w-full">
        <label>
          <Plus :size="14" />
          <span>Load JSON</span>
          <input hidden type="file" accept="application/json" @change="handleLoadJSON" />
        </label>
      </Button>
      <Button as-child size="sm" variant="outline" class="h-7 bg-card gap-1 pl-2 w-full opacity-50 pointer-events-none">
        <label>
          <Plus :size="14" />
          <span>Load PSD</span>
          <input hidden type="file" accept="image/*" @change="() => {}" />
        </label>
      </Button>
    </div>
    <div class="px-3 grid grid-cols-2 gap-4 relative">
      <template v-if="mock.templates.length">
        <button v-for="template in mock.templates" :key="template.id" class="w-full aspect-square rounded-md overflow-hidden group border" @click="loadTemplate(template, 'replace')">
          <img :src="template.pages[0].thumbnail" :alt="template.name" class="group-hover:scale-110 transition-transform" />
        </button>
      </template>
      <template v-else>
        <Skeleton v-for="(_, index) in 6" :key="index" class="w-full aspect-square rounded-md" />
        <span class="text-xs font-semibold text-foreground/60 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 line-clamp-1">No local templates</span>
      </template>
    </div>
  </template>
</template>