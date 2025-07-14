<script setup lang="ts">
import { computed, ref } from 'vue';
import { useMutation } from '@tanstack/vue-query';
import { toast } from 'vue-sonner';

import { Plus, Search, X } from 'lucide-vue-next';
import Button from '@/components/ui/button.vue';
import Input from '@/components/ui/input.vue';
import Skeleton from '@/components/ui/skeleton.vue';

import { useEditorStore } from '@/store/editor';
import { uploadAssetToS3 } from '@/api/upload';
import { useMockStore } from '@/constants/mock';

import AudioItem from './AudioItem.vue';

const editor = useEditorStore();
const mock = useMockStore();

const uploadMutation = useMutation({
  mutationFn: async (file: File) => uploadAssetToS3(file, "audio"),
  onSuccess: (response) => mock.upload("audio", response as any),
});

const handleUpload = (event: Event) => {
  const files = (event.target as HTMLInputElement).files;
  if (!files || !files.length) return;
  toast.promise(uploadMutation.mutateAsync(files[0]), {
    loading: `Your audio asset is being uploaded...`,
    success: `Audio has been successfully uploaded`,
    error: `Ran into an error while uploading the audio`,
  });
};

const handleClick = (audio: any) => {
  console.log("handleClick", audio);
  editor.canvas.audio.add(audio.source, audio.name);
};

</script>

<template>
  <div class="h-full w-full">
    <div class="flex items-center justify-between h-14 border-b px-4">
      <h2 class="font-semibold">Audios</h2>
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
          <div class="flex items-center gap-2">
            <h4 class="text-xs font-semibold line-clamp-1">Uploads</h4>
            <Button as-child size="sm" variant="outline" class="h-7 ml-auto bg-card gap-1 pl-2">
              <label class="inline-flex items-center justify-center whitespace-nowrap text-sm">
                <Plus :size="14" />
                <span>Add File</span>
                <input hidden type="file" accept="audio/*" @change="handleUpload" />
              </label>
            </Button>
            <Button size="sm" variant="link" class="text-primary h-6 font-medium line-clamp-1 px-1.5">
              See All
            </Button>
          </div>
          <div class="flex gap-2.5 items-center overflow-x-scroll scrollbar-hidden relative">
            <template v-if="mock.audios.length">
              <AudioItem v-for="audio in mock.audios" :key="audio.source" :audio="audio" @click="handleClick(audio)" />
            </template>
            <template v-else>
              <Skeleton v-for="(_, index) in 3" :key="index" class="h-16 flex-1 rounded-md" />
              <span class="text-xs font-semibold text-foreground/60 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 leading-none">No Audios</span>
            </template>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between gap-4">
            <h4 class="text-xs font-semibold line-clamp-1">Audios</h4>
            <Button size="sm" variant="link" class="text-primary h-6 font-medium line-clamp-1 px-1.5">
              See All
            </Button>
          </div>
          <div class="flex gap-2.5 items-center overflow-x-scroll scrollbar-hidden relative">
            <Skeleton v-for="(_, index) in 3" :key="index" class="h-16 flex-1 rounded-md" />
            <span class="text-xs font-semibold text-foreground/60 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">Coming Soon</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>