<script setup lang="ts">
import { computed, ref } from 'vue';
import { useMutation } from '@tanstack/vue-query';
import { toast } from 'vue-sonner';
import { storeToRefs } from "pinia";

import { Down as ChevronDown, Right as ChevronRight, Upload as CloudUpload, SettingTwo as Cog, SplitCells as Columns2, ImageFiles as Image, AllApplication as Menu, Redo, Undo, ZoomIn, ZoomOut, Config as Settings } from '@icon-park/vue-next';
import Spinner from '@/components/ui/spinner.vue';
// import Label from '@/components/ui/label.vue';
import ThemeToggle from '@/components/ui/theme-toggle.vue';

import { useEditorStore } from '@/store/editor';
import { useIsTablet } from '@/hooks/use-media-query';
import { createBase64Download, createFileDownload } from '@/lib/utils';
import { fetchExtensionByCodec } from '@/constants/recorder';
import { maxZoom, minZoom, formats } from '@/constants/editor';
import { useMockStore } from '@/constants/mock';
import type { EditorMode, EditorTemplate } from '@/store/editor';

const editor = useEditorStore();
const { name } = storeToRefs(editor);
const codec = computed(() => fetchExtensionByCodec(editor.codec));
const isTablet = useIsTablet();
const mock = useMockStore();
const drawerOpen = ref(false);

const uploadTemplate = useMutation({
  mutationFn: async () => {
    const pages = await editor.exportTemplate();
    console.log("uploadTemplate", editor.name, editor.id, pages)
    const template: EditorTemplate = { name: editor.name, id: editor.id, pages };
    createBase64Download(template, "text/json", `template-${editor.name}-${Date.now()}.json`);
    return template;
  },
  onSuccess: (data) => mock.upload("template", data),
});

const handleExportVideo = async () => {
  try {
    editor.onTogglePreviewModal("open");
    const blob = await editor.exportVideo();
    const file = (editor.file || "output") + "." + codec.value.extension;
    createFileDownload(blob, file);
  } catch (e) {
    const error = e as Error;
    toast.error(error.message || "Failed to export video");
  }
};

const handleSaveTemplate = async () => {
  const promise = uploadTemplate.mutateAsync();
  toast.promise(promise, { loading: "The template is being saved...", success: "The template has been saved successfully", error: "Ran into an error while saving the template" });
};

const onChangeZoom = (zoom: number) => {
  if(zoom < minZoom*100){
    zoom = minZoom*100;
  }
  else if(zoom > maxZoom*100){
    zoom = maxZoom*100;
  }
  editor.canvas.workspace.changeZoom(zoom / 100)
};

import { ClickOutside as vClickOutside } from 'element-plus'

const popoverRef = ref()
const onClickOutside = () => {
  unref(popoverRef).popperRef?.delayHide?.()
}

const zoomValue = computed({
  get(){
    return Math.round(editor.canvas?.workspace?.zoom * 100);
  },

  set(percentage){
    editor.canvas.workspace.changeZoom(percentage / 100)
  }
});

const fileName = computed({
  get(){
    return editor.name;
  },

  set(value){
    console.log(value);
    editor.onChangeName(value);
  }
});

const resizeArtboards = (dimensions: { width: number; height: number }) => {
  editor.resizeArtboards(dimensions);
};

</script>

<template>
  <header class="flex h-14 items-center px-3 bg-card dark:bg-gray-900/40 border-b border-b-border/50 shrink-0">
    <section id="left" class="flex gap-3">
      <template v-if="!isTablet">
        <el-drawer v-model="drawerOpen" direction="ltr">
          <div class="max-w-full pt-3 pb-1 divide-y divide-border/50">
            <el-button text class="gap-3 justify-start w-full h-11" :loading="editor.saving" :disabled="uploadTemplate.isPending.value" @click="handleSaveTemplate">
              <CloudUpload :size="15" />
              <span class="font-medium">Save Template</span>
              <span class="ml-auto">
                <ChevronRight class="text-gray-400" :size="15" />
              </span>
            </el-button>
            <el-button text class="gap-3 justify-start w-full h-11" @click="editor.onTogglePreviewModal('open')">
              <Image :size="15" />
              <span class="font-medium">Export Video</span>
              <span class="ml-auto">
                <ChevronRight class="text-gray-400" :size="15" />
              </span>
            </el-button>
            <!--<el-button text class="gap-3 justify-start w-full h-11" @click="editor.onTogglePreviewModal('open')">
              <Columns2 :size="15" />
              <span class="font-medium">Open Export Preview</span>
              <span class="ml-auto">
                <ChevronRight class="text-gray-400" :size="15" />
              </span>
            </el-button>-->
          </div>
        </el-drawer>
        <el-button @click="drawerOpen = true" icon>
          <Menu :size="15" />
        </el-button>
      </template>
      <div class="flex gap-px">
        <el-popover placement="bottom-start" trigger="click" width="250px">
          <template #reference>
            <el-button type="primary" text bg round class="gap-2">
              <el-text class="w-[100px]" truncated>
                {{ fileName }}
              </el-text>
              <Settings :size="15" />
            </el-button>
          </template>
          <div class="grid gap-y-2">
            <div class="text-xs font-medium">Name</div>
            <div class="flex items-center justify-between gap-4">
              <el-input type="text" v-model="fileName" class="w-full"/>
            </div>
            <div class="text-xs font-medium">Format</div>
            <div class="grid grid-cols-3 gap-4 relative max-h-[250px] overflow-y-scroll scrollbar-hidden">
              <div v-for="format in formats" :key="format.name" class="flex flex-col gap-2">
                <button class="group shrink-0 border flex items-center justify-center overflow-hidden rounded-md shadow-sm transition-colors hover:bg-card p-1.5" @click="resizeArtboards(format.dimensions)">
                  <img :src="format.preview" class="object-contain h-full w-full" />
                </button>
                <span class="text-xxs text-foreground/60 text-center">{{ format.name }}</span>
              </div>
            </div>
          </div>
        </el-popover>
        <el-divider direction="vertical" class="h-8" />
        <el-button-group>
          <el-button type="primary" text bg round @click="editor.canvas.history.undo()" :disabled="!editor.canvas?.history?.canUndo">
            <Undo :size="15" />
            <span class="font-medium hidden md:inline-block">Undo</span>
          </el-button>
          <el-button type="primary" text bg round @click="editor.canvas.history.redo()" :disabled="!editor.canvas?.history?.canRedo">
            <Redo :size="15" />
            <span class="font-medium hidden md:inline-block">Redo</span>
          </el-button>
        </el-button-group>
      </div>
    </section>
    <section id="right" class="ml-auto flex gap-3">
      <div class="gap-px hidden md:flex">
        <el-button-group>
          <el-button type="primary" text bg round @click="editor.canvas.workspace.changeZoom(editor.canvas.workspace.zoom - 0.05)">
            <ZoomOut :size="15" />
          </el-button>
          <el-dropdown class="float-left -mr-4" max-height="200px" @command="(percentage) => editor.canvas.workspace.changeZoom(percentage / 100)">
            <el-button type="primary" text bg round>
              <span class="font-medium">{{ Math.round(editor.canvas?.workspace?.zoom * 100) }}%</span>
              <ChevronDown :size="15" />
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-for="percentage in [10, 15, 20, 25, 50, 75, 100, 125, 150, 175, 200, 250]" :key="percentage" :command="percentage">
                  {{ percentage }}%
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-button type="primary" text bg round @click="editor.canvas.workspace.changeZoom(editor.canvas.workspace.zoom + 0.05)">
            <ZoomIn :size="16" />
          </el-button>
        </el-button-group>
      </div>
      <el-button type="primary" text bg round class="gap-2 w-40 hidden sm:flex" :loading="editor.saving" :disabled="uploadTemplate.isPending.value" @click="handleSaveTemplate">
        <CloudUpload :size="15" />
        <span class="font-medium ml-1">Save Template</span>
      </el-button>
      <el-button type="primary" text bg round class="gap-2 w-36 ml-0" @click="editor.onTogglePreviewModal('open')">
        <Image :size="15" />
        <span class="font-medium ml-1">Export Video</span>
      </el-button>
      <!--<div class="hidden sm:flex gap-px">
        <el-button-group>
          <el-button type="primary" text bg round class="gap-2 w-36" @click="handleExportVideo">
            <Image :size="15" />
            <span class="font-medium ml-1">Export Video</span>
          </el-button>
          <el-button type="primary" text bg round @click="editor.onTogglePreviewModal('open')">
            <ChevronDown :size="15" />
          </el-button>
        </el-button-group>
      </div>-->
      <ThemeToggle />
      <el-dropdown @command="(mode) => editor.onToggleMode(mode as EditorMode)">
        <el-button type="primary" text bg circle icon>
          <Cog :size="15" />
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="creator" :disabled="editor.mode == 'creator'">
              Creator
            </el-dropdown-item>
            <el-dropdown-item command="adapter" :disabled="editor.mode == 'adapter'">
              Adapter
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </section>
  </header>
</template>

<style lang="css">
.element-group {
  display: inline-block;
  vertical-align: middle;
}
</style>