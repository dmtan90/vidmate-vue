<script setup lang="ts">
import { computed, ref, shallowRef, onMounted, nextTick, watch } from 'vue';
import { Search, Close as X, ArrowLeft as Left } from '@icon-park/vue-next';
import { abstract, basic, frames, lines } from '@/constants/elements';
import { useEditorStore } from '@/store/editor';
import { useGiphyGIFs, GIFS_CATEGORIES } from '@/hooks/use-giphy-gifs';
import { useGiphySticker, STICKER_CATEGORIES } from '@/hooks/use-giphy-sticker';
import { useEmoji, EMOJI_CATEGORIES } from '@/hooks/use-emoji';
import { cn } from '@/lib/utils';
import { storeToRefs } from "pinia";
import { isImageLoaded } from '@/lib/utils';
import { toast } from 'vue-sonner';
import bar from '@/assets/editor/charts/bar.svg';
import line from '@/assets/editor/charts/bar.svg';
import pie from '@/assets/editor/charts/bar.svg';
import ExpandedElementView from './ExpandedElementView.vue';

const editor = useEditorStore();
const gifsStore = useGiphyGIFs();
const stickerStore = useGiphySticker();
const emojiStore = useEmoji();
const { images: gifs } = storeToRefs(gifsStore);
const { images: stickers  } = storeToRefs(stickerStore);
const { icons } = storeToRefs(emojiStore);
const refExpand = ref<HTMLElement | null>(null);
const query = ref<string | null>(null);
const expanded = ref<false | string>(false);
const categories = ref([]);

const onAddBasicShape = (klass: string, params: any) => {
  editor.canvas.onAddBasicShape(klass, params);
};

const onAddAbstractShape = (path: string, name: string) => {
  editor.canvas.onAddAbstractShape(path, name);
};

const onAddLine = (points: number[], name: string) => {
  editor.canvas.onAddLine(points, name);
};

const onAddGiphyVideo = (source: string, thumbnail: string) => {
  if (editor.canvas.replacer.active?.type === "gif") {
    const promise = editor.canvas.replacer.replace(source, true);
    toast.promise(promise, { loading: "The gif is being replaced...", success: "The gif has been replaced", error: "Ran into an error while replacing the gif" });
  } else if (!thumbnail || !isImageLoaded(thumbnail)) {
    const promise = editor.canvas.onAddGifFromSource(source);
    toast.promise(promise, { loading: "The gif asset is being loaded...", success: "The gif asset has been added to artboard", error: "Ran into an error adding the gif asset" });
  } else {
    toast.promise(editor.canvas.onAddGifFromThumbnail(source, thumbnail), { error: "Ran into an error adding the gif asset" });
  }
};

const onAddEmoji = (source: string, thumbnail: string) => {
  if (editor.canvas.replacer.active?.type === "gif") {
    const promise = editor.canvas.replacer.replace(source, true);
    toast.promise(promise, { loading: "The emoji is being replaced...", success: "The emoji has been replaced", error: "Ran into an error while replacing the emoji" });
  } else if (!thumbnail || !isImageLoaded(thumbnail)) {
    const promise = editor.canvas.onAddGifFromSource(source);
    toast.promise(promise, { loading: "The emoji is being loaded...", success: "The emoji has been added to artboard", error: "Ran into an error while adding the emoji" });
  } else {
    const promise = editor.canvas.onAddGifFromThumbnail(source, thumbnail);
    toast.promise(promise, { error: "Ran into an error while adding the emoji" });
  }
};

const addChart = (type: string) => {
  editor.canvas.chart.add(type);
};

onMounted(() => {
  gifsStore.loadTrendGifs();
  stickerStore.loadTrendSticker();
  emojiStore.loadEmoji();
});

const handleLoadMore = () => {
  if(refExpand.value && refExpand.value.loadMore){
    nextTick(() => {
      refExpand.value?.loadMore();
    })
  }
}

const handleResetData = () => {
  if(refExpand.value && refExpand.value.resetData){
    nextTick(() => {
      refExpand.value?.resetData();
    })
  }
};

const handleSearchElement = (search) => {
  if(query.value == search){
    return;
  }
  console.log("handleSearchElement", search);
  query.value = search;
  handleResetData();
}

const onBack = () => {
  expanded.value = false;
  query.value = null;
}

watch(expanded, (value) => {
  if(!value){
    categories.value = [];
  }
  else if(value == "gifs"){
    categories.value = GIFS_CATEGORIES;
  }
  else if(value == "sticker"){
    categories.value = STICKER_CATEGORIES;
  }
  else if(value == "emoji"){
    categories.value = EMOJI_CATEGORIES;
  }
});

</script>

<template>
  <div class="h-full w-full">
    <div class="flex items-center justify-between h-14 border-b px-4">
      <h2 class="font-semibold">Elements</h2>
      <el-button size="small" text bg circle class="bg-card h-7 w-7" @click="editor.setActiveSidebarLeft(null)">
        <X :size="16" />
      </el-button>
    </div>
    <div class="flex flex-1 justify-between px-4 py-4 gap-1" v-if="expanded">
      <el-button link circle @click="onBack">
        <Left :size="16" />
      </el-button>
      <el-input v-model="query" placeholder="Search..." class="text-xs" @change="handleResetData">
        <template #prefix>
          <Search :size="15" class="text-foreground/60" />
        </template>
      </el-input>
    </div>
    <el-scrollbar v-if="expanded" class="p-2">
      <div class="flex w-fit">
        <el-button text bg round :type="!query ? 'primary' : ''" @click='handleSearchElement(null)' class="capitalize">#Popular</el-button>
        <template v-for="item in categories" :key="item">
          <el-button text bg round :type="query == item ? 'primary' : ''" @click='handleSearchElement(item)' class="capitalize">{{ '#' + item }}</el-button>
        </template>
      </div>
    </el-scrollbar>
    <section class="sidebar-container pb-4" @scrollend="handleLoadMore">
      <template v-if="!expanded">
        <div class="px-3 flex flex-col gap-6 py-3">
          <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between gap-4">
              <h4 class="text-xs font-semibold line-clamp-1">Basic Shapes</h4>
              <el-button size="small" link class="text-primary font-medium line-clamp-1" @click="expanded = 'basic'">
                See All
              </el-button>
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
              <el-button size="small" link class="text-primary font-medium line-clamp-1" @click="expanded = 'abstract'">
                See All
              </el-button>
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
              <el-button size="small" link class="text-primary font-medium line-clamp-1" @click="expanded = 'frames'">
                See All
              </el-button>
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
              <el-button size="small" link class="text-primary font-medium line-clamp-1">
                See All
              </el-button>
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
          <!--<div class="flex flex-col gap-2">
            <div class="flex items-center justify-between gap-4">
              <h4 class="text-xs font-semibold line-clamp-1">Charts</h4>
              <el-button size="small" link class="text-primary font-medium line-clamp-1">
                See All
              </el-button>
            </div>
            <div class="flex gap-2.5 items-center overflow-x-scroll relative scrollbar-hidden">
              <el-button
                @click="addChart('bar')"
                class="group shrink-0 h-16 w-16 border flex items-center justify-center overflow-hidden rounded-md p-2 text-gray-800/80 dark:text-gray-100/80 transition-colors shadow-sm hover:bg-card hover:text-gray-800 dark:hover:text-gray-100"
              >
                <img :src="bar" alt="bar-chart" />
              </el-button>
              <el-button
                @click="addChart('line')"
                class="group shrink-0 h-16 w-16 border flex items-center justify-center overflow-hidden rounded-md p-2 text-gray-800/80 dark:text-gray-100/80 transition-colors shadow-sm hover:bg-card hover:text-gray-800 dark:hover:text-gray-100"
              >
                <img :src="line" alt="line-chart" />
              </el-button>
              <el-button
                @click="addChart('pie')"
                class="group shrink-0 h-16 w-16 border flex items-center justify-center overflow-hidden rounded-md p-2 text-gray-800/80 dark:text-gray-100/80 transition-colors shadow-sm hover:bg-card hover:text-gray-800 dark:hover:text-gray-100"
              >
                <img :src="pie" alt="pie-chart" />
              </el-button>
            </div>
          </div>-->
          <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between gap-4">
              <h4 class="text-xs font-semibold line-clamp-1">GIFs</h4>
              <el-button size="small" link class="text-primary font-medium line-clamp-1" @click="expanded = 'gifs'">
                See All
              </el-button>
            </div>
            <div class="flex gap-2.5 items-center overflow-x-scroll relative scrollbar-hidden">
              <template v-if="gifs.length">
                <button v-for="({ preview, details: { src } }) in gifs" :key="preview" @click="onAddGiphyVideo(src, preview, true)" class="group shrink-0 h-16 w-16 border flex items-center justify-center overflow-hidden rounded-md shadow-sm">
                  <img :src="preview" crossOrigin="anonymous" class="h-full w-full rounded-md transition-transform group-hover:scale-110 object-cover" />
                </button>
              </template>
              <template v-else>
                <el-skeleton v-for="(_, index) in 3" :key="index" animated class="h-16 flex-1 rounded-md" />
                <span class="text-xs font-semibold text-foreground/60 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 leading-none">No Images</span>
              </template>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between gap-4">
              <h4 class="text-xs font-semibold line-clamp-1">Stickers</h4>
              <el-button size="small" link class="text-primary font-medium line-clamp-1" @click="expanded = 'sticker'">
                See All
              </el-button>
            </div>
            <div class="flex gap-2.5 items-center overflow-x-scroll relative scrollbar-hidden">
              <template v-if="stickers.length">
                <button v-for="({ preview, details: { src } }) in stickers" :key="preview" @click="onAddGiphyVideo(src, preview, true)" class="group shrink-0 h-16 w-16 border flex items-center justify-center overflow-hidden rounded-md shadow-sm">
                  <img :src="preview" crossOrigin="anonymous" class="h-full w-full rounded-md transition-transform group-hover:scale-110 object-cover" />
                </button>
              </template>
              <template v-else>
                <el-skeleton v-for="(_, index) in 3" :key="index" animated class="h-16 flex-1 rounded-md" />
                <span class="text-xs font-semibold text-foreground/60 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 leading-none">No Images</span>
              </template>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between gap-4">
              <h4 class="text-xs font-semibold line-clamp-1">Emoji</h4>
              <el-button size="small" link class="text-primary font-medium line-clamp-1" @click="expanded = 'emoji'">
                See All
              </el-button>
            </div>
            <div class="flex gap-2.5 items-center overflow-x-scroll relative scrollbar-hidden">
              <template v-if="icons.length">
                <button v-for="({ preview, details: { src } }) in icons" :key="preview" @click="onAddEmoji(src, preview, true)" class="group shrink-0 h-16 w-16 border flex items-center justify-center overflow-hidden rounded-md shadow-sm">
                  <img :src="src" crossOrigin="anonymous" class="h-full w-full rounded-md transition-transform group-hover:scale-110 object-cover" />
                </button>
              </template>
              <template v-else>
                <el-skeleton v-for="(_, index) in 3" :key="index" animated class="h-16 flex-1 rounded-md" />
                <span class="text-xs font-semibold text-foreground/60 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 leading-none">No Images</span>
              </template>
            </div>
          </div>
          <!--<div class="flex flex-col gap-2">
            <div class="flex items-center justify-between gap-4">
              <h4 class="text-xs font-semibold line-clamp-1">Text</h4>
              <el-button size="small" link class="text-primary font-medium line-clamp-1">
                See All
              </el-button>
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
          <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between gap-4">
              <h4 class="text-xs font-semibold line-clamp-1">Clips</h4>
              <el-button size="small" link class="text-primary font-medium line-clamp-1">
                See All
              </el-button>
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
          </div>-->
        </div>
      </template>
      <template v-else>
        <div class="px-3 grid grid-cols-3 gap-2.5 pt-4">
          <ExpandedElementView :match="expanded" :query="query" ref="refExpand"/>
        </div>
      </template>
    </section>
  </div>
</template>