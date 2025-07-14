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
import { isImageLoaded } from '@/lib/utils';

import AudioItem from './AudioItem.vue';

const editor = useEditorStore();
const mock = useMockStore();

const uploadMutation = useMutation({
  mutationFn: async ({ file, type }: { type: "image" | "video" | "audio"; file: File }) => {
    return uploadAssetToS3(file, type);
  },
  onSuccess: (response, params) => {
    console.log("uploadMutation", response, params);
    switch (params.type) {
      case "image":
        mock.upload("image", response as any);
        break;
      case "video":
        mock.upload("video", response as any);
        break;
      case "audio":
        mock.upload("audio", response as any);
        break;
    }
  },
});

const handleUpload = (event: Event, type: "image" | "video" | "audio") => {
  const files = (event.target as HTMLInputElement).files;
  if (!files || !files.length) return;
  const promises = Array.from(files).map((file) => uploadMutation.mutateAsync({ file, type }));
  toast.promise(Promise.all(promises), {
    loading: `The assets are being uploaded`,
    success: `The assets have been successfully uploaded`,
    error: `Ran into an error while uploading the assets`,
  });
};

const handleClickImage = (source: string, thumbnail: string) => {
  // const thumbnail = (event.currentTarget as HTMLButtonElement).querySelector("img");
  if (editor.canvas.replacer.active?.type === "image") {
    const promise = editor.canvas.replacer.replace(source, true);
    toast.promise(promise, { loading: "The image is being replaced...", success: "The image has been replaced", error: "Ran into an error while replacing the image" });
  } else if (!thumbnail || !isImageLoaded(thumbnail)) {
    const promise = editor.canvas.onAddImageFromSource(source);
    toast.promise(promise, { loading: "The image is being loaded...", success: "The image has been added to artboard", error: "Ran into an error adding the image asset" });
  } else {
    const promise = editor.canvas.onAddImageFromThumbail(source, thumbnail);
    toast.promise(promise, { error: "Ran into an error adding the image asset" });
  }
};

const handleClickVideo = (source: string, thumbnail: string) => {
  // const thumbnail = (event.currentTarget as HTMLButtonElement).querySelector("img");
  if (!thumbnail || !isImageLoaded(thumbnail)) {
    const promise = editor.canvas.onAddVideoFromSource(source);
    toast.promise(promise, { loading: "The video asset is being loaded...", success: "The video asset has been added to artboard", error: "Ran into an error adding the video asset" });
  } else {
    const promise = editor.canvas.onAddVideoFromThumbail(source, thumbnail);
    toast.promise(promise, { error: "Ran into an error adding the video asset" });
  }
};

const handleClickAudio = (audio: any) => {
  const promise = editor.canvas.audio.add(audio.source, audio.name);
  toast.promise(promise, { loading: "The audio asset is being loaded...", success: "The audio asset has been added to timeline", error: "Ran into an error adding the audio asset" });
};

</script>

<template>
  <div class="h-full w-full">
    <div class="flex items-center justify-between h-14 border-b px-4">
      <h2 class="font-semibold">Uploads</h2>
      <Button size="icon" variant="outline" class="bg-card h-7 w-7" @click="editor.setActiveSidebarLeft(null)">
        <X :size="16" />
      </Button>
    </div>
    <section class="sidebar-container pb-4">
      <div class="px-3 pt-4">
        <div class="relative">
          <Input placeholder="Search..." class="text-xs pl-8" />
          <Search :size="15" class="absolute top-1/2 -translate-y-1/2 left-2.5 text-foreground/60" />
        </div>
      </div>
      <div class="px-3 flex flex-col divide-y">
        <div class="flex flex-col gap-4 py-6">
          <div class="flex items-center gap-2">
            <h4 class="text-xs font-semibold line-clamp-1">Images</h4>
            <Button as-child size="sm" variant="outline" class="h-7 ml-auto bg-card gap-1 pl-2">
              <label class="inline-flex items-center justify-center whitespace-nowrap text-sm">
                <Plus :size="14" />
                <span>Add File</span>
                <input hidden multiple type="file" accept="image/*" @change="(event) => handleUpload(event, 'image')" />
              </label>
            </Button>
            <Button size="sm" variant="link" class="text-primary h-6 font-medium line-clamp-1 px-1.5">
              See All
            </Button>
          </div>
          <div class="flex gap-2.5 items-center overflow-x-scroll scrollbar-hidden relative">
            <template v-if="mock.images.length">
              <button v-for="({ source, thumbnail }) in mock.images" :key="source" @click="handleClickImage(source, thumbnail)" class="group shrink-0 h-16 w-16 border flex items-center justify-center overflow-hidden rounded-md shadow-sm">
                <img :src="thumbnail" crossOrigin="anonymous" class="h-full w-full rounded-md transition-transform group-hover:scale-110 object-cover" />
              </button>
            </template>
            <template v-else>
              <Skeleton v-for="(_, index) in 3" :key="index" class="h-16 flex-1 rounded-md" />
              <span class="text-xs font-semibold text-foreground/60 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 leading-none">No Images</span>
            </template>
          </div>
        </div>
        <div class="flex flex-col gap-4 py-6">
          <div class="flex items-center gap-2">
            <h4 class="text-xs font-semibold line-clamp-1">Videos</h4>
            <Button as-child size="sm" variant="outline" class="h-7 ml-auto bg-card gap-1 pl-2">
              <label class="inline-flex items-center justify-center whitespace-nowrap text-sm">
                <Plus :size="14" />
                <span>Add File</span>
                <input hidden multiple type="file" accept="video/*" @change="(event) => handleUpload(event, 'video')" />
              </label>
            </Button>
            <Button size="sm" variant="link" class="text-primary h-6 font-medium line-clamp-1 px-1.5">
              See All
            </Button>
          </div>
          <div class="flex gap-2.5 items-center overflow-x-scroll scrollbar-hidden relative">
            <template v-if="mock.videos.length">
              <button v-for="({ source, thumbnail }) in mock.videos" :key="source" @click="handleClickVideo(source, thumbnail)" class="group shrink-0 h-16 w-16 border flex items-center justify-center overflow-hidden rounded-md shadow-sm">
                <img :src="thumbnail" crossOrigin="anonymous" class="h-full w-full rounded-md transition-transform group-hover:scale-110 object-cover" />
              </button>
            </template>
            <template v-else>
              <Skeleton v-for="(_, index) in 3" :key="index" class="h-16 flex-1 rounded-md" />
              <span class="text-xs font-semibold text-foreground/60 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 leading-none">No Videos</span>
            </template>
          </div>
        </div>
        <div class="flex flex-col gap-4 py-6">
          <div class="flex items-center gap-2">
            <h4 class="text-xs font-semibold line-clamp-1">Audios</h4>
            <Button as-child size="sm" variant="outline" class="h-7 ml-auto bg-card gap-1 pl-2">
              <label class="inline-flex items-center justify-center whitespace-nowrap text-sm">
                <Plus :size="14" />
                <span>Add File</span>
                <input hidden multiple type="file" accept="audio/*" @change="(event) => handleUpload(event, 'audio')" />
              </label>
            </Button>
            <Button size="sm" variant="link" class="text-primary h-6 font-medium line-clamp-1 px-1.5">
              See All
            </Button>
          </div>
          <div class="flex gap-2.5 items-center overflow-x-scroll scrollbar-hidden relative">
            <template v-if="mock.audios.length">
              <AudioItem v-for="audio in mock.audios" :key="audio.source" :audio="audio" @click="handleClickAudio(audio)" />
            </template>
            <template v-else>
              <Skeleton v-for="(_, index) in 3" :key="index" class="h-16 flex-1 rounded-md" />
              <span class="text-xs font-semibold text-foreground/60 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 leading-none">No Audios</span>
            </template>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>