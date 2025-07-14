<script setup lang="ts">
import { computed, ref } from 'vue';
import { toast } from 'vue-sonner';

import Button from '@/components/ui/button.vue';
import Progress from '@/components/ui/progress.vue';
import Spinner from '@/components/ui/spinner.vue';
import Label from '@/components/ui/label.vue';
import SelectRoot from '@/components/ui/select-root.vue';
import SelectContent from '@/components/ui/select-content.vue';
import SelectItem from '@/components/ui/select-item.vue';
import SelectTrigger from '@/components/ui/select-trigger.vue';
import SelectValue from '@/components/ui/select-value.vue';
import Input from '@/components/ui/input.vue';

import { useEditorStore } from '@/store/editor';
import { ExportProgress, type ExportMode } from '@/store/editor';
import { createFileDownload } from '@/lib/utils';
import { codecs, fetchExtensionByCodec, fps } from '@/constants/recorder';

import ProgressIcon from './ProgressIcon.vue';
import ProgressText from './ProgressText.vue';

const editor = useEditorStore();

const codec = computed(() => fetchExtensionByCodec(editor.codec));
const progress = computed(() => editor.progress.capture * 0.4 + editor.progress.compile * 0.6);

const handleExportVideo = async () => {
  try {
    const blob = await editor.exportVideo();
    const file = (editor.file || "output") + "." + codec.value.extension;
    createFileDownload(blob, file);
  } catch (e) {
    const error = e as Error;
    console.warn(error);
    toast.error(error.message || "Failed to export video");
  }
};

</script>

<template>
  <div class="grid grid-cols-12 gap-6">
    <div class="col-span-12 md:col-span-7">
      <div class="relative flex items-center justify-center h-64 sm:h-96 p-3 w-full bg-transparent-pattern">
        <video v-if="editor.blob" controls class="h-full w-full object-contain">
          <source :src="URL.createObjectURL(editor.blob)" :type="codec.mimetype" />
        </video>
        <img v-else-if="editor.frame" :src="editor.frame" alt="preview" class="h-full w-full object-contain" />
      </div>
    </div>
    <div class="col-span-12 md:col-span-5 flex flex-col gap-6">
      <div class="flex flex-col">
        <label class="text-xs font-semibold">Export Settings</label>
        <div class="flex flex-col px-2.5 pt-3.5 gap-3">
          <div class="grid grid-cols-12 items-center">
            <Label class="text-xs col-span-3">FPS</Label>
            <SelectRoot v-model="editor.fps" @update:model-value="editor.onChangeExportFPS">
              <SelectTrigger class="text-xs w-36 col-span-9 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="f in fps" :key="f" :value="f" class="text-xs">
                  {{ f }}
                </SelectItem>
              </SelectContent>
            </SelectRoot>
          </div>
          <div class="grid grid-cols-12 items-center">
            <Label class="text-xs col-span-3">Codec</Label>
            <SelectRoot v-model="editor.codec" @update:model-value="editor.onChangeExportCodec">
              <SelectTrigger class="text-xs w-36 col-span-9 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="c in codecs" :key="c" :value="c" class="text-xs">
                  {{ c }}
                </SelectItem>
              </SelectContent>
            </SelectRoot>
          </div>
          <div class="grid grid-cols-12 items-center">
            <Label class="text-xs col-span-3">File Name</Label>
            <div class="flex col-span-9">
              <Input :value="editor.file" @update:model-value="editor.onChangeFileName" class="flex-1 text-xs h-8 rounded-r-none max-w-72" placeholder="output" />
              <div class="shrink-0 text-xs h-8 px-3 border grid place-items-center rounded-md rounded-l-none shadow-sm text-muted-foreground w-16">.{{ codec.extension }}</div>
            </div>
          </div>
          <div class="grid grid-cols-12 items-center">
            <Label class="text-xs col-span-3">Exports</Label>
            <SelectRoot v-model="editor.exports" @update:model-value="editor.onChangeExportMode">
              <SelectTrigger class="text-xs w-44 col-span-9 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="both" class="text-xs">
                  Video with Audio
                </SelectItem>
                <SelectItem value="video" class="text-xs">
                  Video Only
                </SelectItem>
              </SelectContent>
            </SelectRoot>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-4 mt-auto">
        <div v-if="editor.exporting > ExportProgress.None" class="flex flex-col relative">
          <Progress :value="progress" class="h-7 rounded-md bg-gray-300" />
          <div class="text-xxs absolute top-1/2 -translate-y-1/2 left-2 flex items-center gap-2">
            <ProgressIcon :progress="editor.exporting" />
            <ProgressText :progress="editor.exporting" />
          </div>
        </div>
        <div class="flex flex-row gap-4">
          <Button variant="outline" class="flex-1 text-xs" @click="editor.onTogglePreviewModal('close')">
            <span v-if="editor.exporting > ExportProgress.Completed">Cancel Export</span>
            <span v-else>Close</span>
          </Button>
          <Button :disabled="editor.exporting > ExportProgress.Completed" variant="default" class="flex-1 text-xs bg-primary hover:bg-primary/90" @click="handleExportVideo">
            Start Export
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
