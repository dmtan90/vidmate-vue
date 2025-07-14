<script setup lang="ts">
import { computed, ref } from 'vue';
import { useMutation } from '@tanstack/vue-query';
import { toast } from 'vue-sonner';

import { Plus, Search, X } from 'lucide-vue-next';
import Button from '@/components/ui/button.vue';
import Input from '@/components/ui/input.vue';
import Skeleton from '@/components/ui/skeleton.vue';

import { useEditorStore } from '@/store/editor';
import { isImageLoaded } from '@/lib/utils';
import { useMockStore } from '@/constants/mock';
import { uploadAssetToS3 } from '@/api/upload';

const editor = useEditorStore();
const mock = useMockStore();

const uploadMutation = useMutation({
  mutationFn: async (file: File) => uploadAssetToS3(file, "video"),
  onSuccess: (response) => mock.upload("video", response as any),
});

const handleUpload = (event: Event) => {
  const files = (event.target as HTMLInputElement).files;
  if (!files || !files.length) return;
  const promise = uploadMutation.mutateAsync(files[0]);
  toast.promise(promise, {
    loading: `Your video asset is being uploaded...`,
    success: `Video has been successfully uploaded`,
    error: `Ran into an error while uploading the video`,
  });
};

const handleClick = (source: string, thumbnail: string) => {
  // const thumbnail = (event.currentTarget as HTMLButtonElement).querySelector("img");
  if (editor.canvas.replacer.active?.type === "video") {
    const promise = editor.canvas.replacer.replace(source, true);
    toast.promise(promise, { loading: "The video is being replaced...", success: "The video has been replaced", error: "Ran into an error while replacing the video" });
  } else if (!thumbnail || !isImageLoaded(thumbnail)) {
    const promise = editor.canvas.onAddVideoFromSource(source);
    toast.promise(promise, { loading: "The video asset is being loaded...", success: "The video asset has been added to artboard", error: "Ran into an error adding the video asset" });
  } else {
    toast.promise(editor.canvas.onAddVideoFromThumbail(source, thumbnail), { error: "Ran into an error adding the video asset" });
  }
};

</script>

<template>
  <div class="h-full w-full">
    <div class="flex items-center justify-between h-14 border-b px-4">
      <h2 class="font-semibold">Videos</h2>
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
                <input hidden type="file" accept="video/*" @change="handleUpload" />
              </label>
            </Button>
            <Button size="sm" variant="link" class="text-primary h-6 font-medium line-clamp-1 px-1.5">
              See All
            </Button>
          </div>
          <div class="flex gap-2.5 items-center overflow-x-scroll scrollbar-hidden relative">
            <template v-if="mock.videos.length">
              <button v-for="({ source, thumbnail }) in mock.videos" :key="source" @click="handleClick(source, thumbnail)" class="group shrink-0 h-16 w-16 border flex items-center justify-center overflow-hidden rounded-md shadow-sm">
                <img :src="thumbnail" crossOrigin="anonymous" class="h-full w-full rounded-md transition-transform group-hover:scale-110 object-cover" />
              </button>
            </template>
            <template v-else>
              <Skeleton v-for="(_, index) in 3" :key="index" class="h-16 flex-1 rounded-md" />
              <span class="text-xs font-semibold text-foreground/60 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 leading-none">No Videos</span>
            </template>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between gap-4">
            <h4 class="text-xs font-semibold line-clamp-1">Videos</h4>
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
