<script setup lang="ts">
import { computed, ref } from 'vue';
import { useMutation } from '@tanstack/vue-query';
import { toast } from 'vue-sonner';

import { ChevronDown, ChevronRight, CloudUpload, Cog, Columns2, Image, Menu, Redo, Undo, ZoomIn, ZoomOut } from 'lucide-vue-next';
import Button from '@/components/ui/button.vue';
import DropdownMenuRoot from '@/components/ui/dropdown-menu-root.vue';
import DropdownMenuTrigger from '@/components/ui/dropdown-menu-trigger.vue';
import DropdownMenuContent from '@/components/ui/dropdown-menu-content.vue';
import DropdownMenuGroup from '@/components/ui/dropdown-menu-group.vue';
import DropdownMenuItem from '@/components/ui/dropdown-menu-item.vue';
import DropdownMenuRadioGroup from '@/components/ui/dropdown-menu-radio-group.vue';
import DropdownMenuRadioItem from '@/components/ui/dropdown-menu-radio-item.vue';
import ThemeToggle from '@/components/ui/theme-toggle.vue';
import PopoverRoot from '@/components/ui/popover-root.vue';
import PopoverContent from '@/components/ui/popover-content.vue';
import PopoverTrigger from '@/components/ui/popover-trigger.vue';
import Spinner from '@/components/ui/spinner.vue';
import Label from '@/components/ui/label.vue';
import Slider from '@/components/ui/slider.vue';
import Input from '@/components/ui/input.vue';
import DrawerRoot from '@/components/ui/drawer-root.vue';
import DrawerContent from '@/components/ui/drawer-content.vue';
import DrawerTrigger from '@/components/ui/drawer-trigger.vue';

import { useEditorStore } from '@/store/editor';
import { useIsTablet } from '@/hooks/use-media-query';
import { createBase64Download, createFileDownload } from '@/lib/utils';
import { fetchExtensionByCodec } from '@/constants/recorder';
import { maxZoom, minZoom } from '@/constants/editor';
import { useMockStore } from '@/constants/mock';
import type { EditorMode, EditorTemplate } from '@/store/editor';

const editor = useEditorStore();
const codec = computed(() => fetchExtensionByCodec(editor.codec));
const isTablet = useIsTablet();
const mock = useMockStore();

const upload = useMutation({
  mutationFn: async () => {
    const pages = await editor.exportTemplate();
    const template: EditorTemplate = { name: editor.name, id: editor.id, pages };
    createBase64Download(template, "text/json", `template-${Date.now()}.json`);
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
  const promise = upload.mutateAsync();
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

</script>

<template>
  <header class="flex h-14 items-center px-3 bg-card dark:bg-gray-900/40 border-b border-b-border/50 shrink-0">
    <section id="left" class="flex gap-3">
      <template v-if="!isTablet">
        <DrawerRoot>
          <DrawerTrigger as-child>
            <Button size="icon" variant="secondary">
              <Menu :size="15" />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div class="max-w-full pt-3 pb-1 divide-y divide-border/50">
              <Button size="sm" class="gap-3 justify-start w-full h-11" variant="ghost" :disabled="upload.isPending.value" @click="handleSaveTemplate">
                <CloudUpload :size="15" />
                <span class="font-medium">Save Template</span>
                <span class="ml-auto">
                  <Spinner v-if="editor.saving" class="h-4 w-4 text-primary-foreground" />
                  <ChevronRight v-else class="text-gray-400" :size="15" />
                </span>
              </Button>
              <Button size="sm" class="gap-3 justify-start w-full h-11" variant="ghost" @click="handleExportVideo">
                <Image :size="15" />
                <span class="font-medium">Export Video</span>
                <span class="ml-auto">
                  <ChevronRight class="text-gray-400" :size="15" />
                </span>
              </Button>
              <Button size="sm" class="gap-3 justify-start w-full h-11" variant="ghost" @click="editor.onTogglePreviewModal('open')">
                <Columns2 :size="15" />
                <span class="font-medium">Open Export Preview</span>
                <span class="ml-auto">
                  <ChevronRight class="text-gray-400" :size="15" />
                </span>
              </Button>
            </div>
          </DrawerContent>
        </DrawerRoot>
      </template>
      <div class="flex gap-px">
        <Button variant="secondary" size="sm" class="gap-1.5 rounded-r-none" @click="editor.canvas.history.undo()" :disabled="!editor.canvas?.history?.canUndo">
          <Undo :size="15" />
          <span class="font-medium hidden md:inline-block">Undo</span>
        </Button>
        <Button variant="secondary" size="icon" class="rounded-l-none" @click="editor.canvas.history.redo()" :disabled="!editor.canvas?.history?.canRedo">
          <Redo :size="15" />
        </Button>
      </div>
    </section>
    <section id="right" class="ml-auto flex gap-3">
      <div class="gap-px hidden md:flex">
        <Button variant="secondary" size="icon" class="rounded-r-none" @click="editor.canvas.workspace.changeZoom(editor.canvas.workspace.zoom - 0.05)">
          <ZoomOut :size="15" />
        </Button>
        <DropdownMenuRoot>
          <DropdownMenuTrigger as-child>
            <Button variant="secondary" size="sm" class="rounded-none gap-1.5 justify-between w-24 lg:w-28">
              <span class="font-medium">{{ Math.round(editor.canvas?.workspace?.zoom * 100) }}%</span>
              <ChevronDown :size="15" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent class="w-24 lg:w-28">
            <DropdownMenuGroup>
              <DropdownMenuItem v-for="percentage in [10, 15, 20, 25, 50, 75, 100, 125, 150, 175, 200, 250]" :key="percentage" class="text-xs" @click="editor.canvas.workspace.changeZoom(percentage / 100)">
                {{ percentage }}%
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenuRoot>
        <Button variant="secondary" size="icon" class="rounded-l-none" @click="editor.canvas.workspace.changeZoom(editor.canvas.workspace.zoom + 0.05)">
          <ZoomIn :size="16" />
        </Button>
      </div>
      <PopoverRoot>
        <PopoverTrigger as-child>
          <Button size="icon" variant="secondary" class="flex md:hidden">
            <ZoomIn :size="15" />
          </Button>
        </PopoverTrigger>
        <PopoverContent @open-auto-focus.prevent align="end">
          <Label class="text-xs font-medium">Zoom (%)</Label>
          <div class="flex items-center justify-between gap-4">
            <Slider :step="5" :min="minZoom * 100" :max="maxZoom * 100" :value="[Math.round(editor.canvas.workspace.zoom * 100)]" @update:model-value="([zoom]) => onChangeZoom(zoom)" />
            <Input
              type="number"
              class="h-8 w-16 text-xs"
              :value="Math.round(editor.canvas.workspace.zoom * 100)"
              :step="5" :min="minZoom * 100" :max="maxZoom * 100"
              @change="(event) => onChangeZoom(event.target.value)"
            />
          </div>
        </PopoverContent>
      </PopoverRoot>
      <Button size="sm" class="gap-2 w-40 hidden sm:flex" :disabled="upload.isPending.value" @click="handleSaveTemplate">
        <Spinner v-if="editor.saving" class="h-4 w-4 text-primary-foreground" />
        <CloudUpload v-else :size="15" />
        <span class="font-medium">Save Template</span>
      </Button>
      <div class="hidden sm:flex gap-px">
        <Button size="sm" class="gap-2 rounded-r-none w-36" @click="handleExportVideo">
          <Image :size="15" />
          <span class="font-medium">Export Video</span>
        </Button>
        <Button size="icon" class="rounded-l-none" @click="editor.onTogglePreviewModal('open')">
          <ChevronDown :size="15" />
        </Button>
      </div>
      <ThemeToggle />
      <DropdownMenuRoot>
        <DropdownMenuTrigger as-child>
          <Button variant="secondary" size="icon">
            <Cog :size="15" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="min-w-32">
          <DropdownMenuRadioGroup v-model="editor.mode" @update:model-value="(mode) => editor.onToggleMode(mode as EditorMode)">
            <DropdownMenuRadioItem class="text-xs" value="creator">
              Creator
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem class="text-xs" value="adapter">
              Adapter
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenuRoot>
    </section>
  </header>
</template>