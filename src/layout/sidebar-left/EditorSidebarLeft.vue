<script setup lang="ts">
import { computed, shallowRef, watch, ref } from 'vue';

import { Clapperboard, Grid2X2, Image, Layers, Music, Scaling, Type, Upload, Video, ChartArea, Bot } from 'lucide-vue-next';

import Button from '@/components/ui/button.vue';
import DrawerRoot from '@/components/ui/drawer-root.vue';
import DrawerContent from '@/components/ui/drawer-content.vue';
import DrawerTrigger from '@/components/ui/drawer-trigger.vue';

import { useIsTablet } from '@/hooks/use-media-query';
import { useEditorStore } from '@/store/editor';
import { storeToRefs } from "pinia";

import { leftSidebarWidth } from '@/constants/layout';
import { cn } from '@/lib/utils';

import AudioMenu from './components/audio.vue';
import ElementMenu from './components/element.vue';
import FormatMenu from './components/format.vue';
import ImageMenu from './components/image.vue';
import SceneMenu from './components/scene.vue';
import TemplateMenu from './components/template.vue';
import TextMenu from './components/text.vue';
import UploadMenu from './components/upload.vue';
import VideoMenu from './components/video.vue';
import ChartMenu from './components/chart.vue';
import PromptMenu from './components/prompt.vue';

const sidebarComponentMap: Record<string, any> = {
  scenes: SceneMenu,
  templates: TemplateMenu,
  texts: TextMenu,
  uploads: UploadMenu,
  images: ImageMenu,
  videos: VideoMenu,
  audios: AudioMenu,
  charts: ChartMenu,
  elements: ElementMenu,
  formats: FormatMenu,
  prompt: PromptMenu,
};

const editor = useEditorStore();
const isTablet = useIsTablet();
const { sidebarLeft } = storeToRefs(editor);

// console.log(isTablet);
// watch(isTablet, (value) => {
//   console.log(isTablet, value);
// })

const items = computed(() => {
  return [
    {
      icon: Clapperboard,
      label: "Scenes",
      value: "scenes",
    },
    {
      icon: Grid2X2,
      label: "Templates",
      value: "templates",
    },
    {
      icon: Layers,
      label: "Elements",
      value: "elements",
    },
    // {
    //   icon: ChartArea,
    //   label: "Charts",
    //   value: "charts",
    // },
    {
      icon: Type,
      label: "Texts",
      value: "texts",
    },
    {
      icon: Image,
      label: "Images",
      value: "images",
    },
    {
      icon: Video,
      label: "Videos",
      value: "videos",
    },
    {
      icon: Music,
      label: "Audios",
      value: "audios",
    },
    {
      icon: Upload,
      label: "Uploads",
      value: "uploads",
    },
    {
      icon: Bot,
      label: "AI",
      value: "prompt",
    },
    {
      icon: Scaling,
      label: "Formats",
      value: "formats",
    },
  ];
});

const activeSidebarComponent = ref(null);
watch(sidebarLeft, (menu) => {
  if(menu){
    activeSidebarComponent.value = shallowRef(sidebarComponentMap[menu]);
  }
  else{
    activeSidebarComponent.value = null;
  }
});

// const activeSidebarComponent = computed(() => {
//   console.log("activeSidebarComponent", editor.sidebarLeft);
//   return editor.sidebarLeft ? shallowRef(sidebarComponentMap[editor.sidebarLeft]) : null;
// });

const handleDrawerClose = () => {
  editor.setActiveSidebarLeft(null);
};

</script>

<template>
  <template v-if="!isTablet">
    <aside :class="cn('h-16 absolute bottom-0 left-0 bg-card dark:bg-gray-900/40 border-t border-t-border/25 flex items-center z-10 gap-2.5 w-screen overflow-x-scroll scrollbar-hidden px-1.5')">
      <Button
        v-for="{ icon: Icon, label, value } in items"
        :key="value"
        size="icon"
        variant="ghost"
        :aria-label="value"
        :class="cn('min-w-16 h-14 flex flex-col gap-2 hover:bg-transparent hover:text-primary', editor.sidebarLeft === value ? 'text-primary' : 'text-foreground')"
        @click="editor.setActiveSidebarLeft(editor.sidebarLeft === value ? null : value)"
      >
        <component :is="Icon" :size="20" :stroke-width="1.5" />
        <span class="text-xxs leading-none">{{ label }}</span>
      </Button>
    </aside>
    <DrawerRoot :open="!!activeSidebarComponent" @update:open="handleDrawerClose">
      <DrawerContent>
        <component :is="activeSidebarComponent.value" v-if="activeSidebarComponent" />
      </DrawerContent>
    </DrawerRoot>
  </template>

  <template v-else>
    <aside class="w-20 sidebar-wrapper scrollbar-hidden bg-card/75 dark:bg-gray-900/30 flex flex-col items-center py-2 border-r border-r-border/50 gap-2 shrink-0">
      <Button
        v-for="{ icon: Icon, label, value } in items"
        :key="value"
        size="icon"
        variant="ghost"
        :aria-label="value"
        :class="cn('w-16 h-16 flex flex-col gap-2 shrink-0', editor.sidebarLeft === value ? 'bg-card shadow-sm border hover:bg-card' : 'bg-transparent hover:bg-accent')"
        @click="editor.setActiveSidebarLeft(editor.sidebarLeft === value ? null : value)"
      >
        <component :is="Icon" :size="20" :stroke-width="1.5" />
        <span class="text-xxs leading-none">{{ label }}</span>
      </Button>
    </aside>
    <aside v-if="activeSidebarComponent" :style="{ width: leftSidebarWidth + 'px' }" class="overflow-hidden bg-card/60 border-r shrink-0">
      <component :is="activeSidebarComponent.value" :key="editor.sidebarLeft" />
    </aside>
  </template>
</template>
