<script setup lang="ts">
import { computed, ref } from 'vue';
import { Refresh as RefreshCcw } from '@icon-park/vue-next';

import { useEditorStore } from '@/store/editor';
import { generateCTA, generateHeadline, generateDescription, useGenerateCTASuggestions, useGenerateDescriptionSuggestions, useGenerateHeadlineSuggestions } from '@/api/ai';
import { cn } from '@/lib/utils';

// import Button from '@/components/ui/button.vue';

// Placeholder for AISelectPluginProps
interface AISelectPluginProps {}

// Placeholder for fabric.Textbox type
interface FabricTextbox {
  meta?: { label: string };
  // Add other properties as needed
}

type QueryFunction = typeof useGenerateCTASuggestions;

const magicWriteMap: Record<string, QueryFunction> = {
  // "cta-text": useGenerateCTASuggestions,
  // "headline-text": useGenerateHeadlineSuggestions,
  // "description-text": useGenerateDescriptionSuggestions,
  "cta-text": generateCTA,
  "headline-text": generateHeadline,
  "description-text": generateDescription,
};

// const props = defineProps<AISelectPluginProps>();

const editor = useEditorStore();
const selected = computed(() => editor.canvas.selection.active as FabricTextbox);

const useMagicWrite = computed(() => {
  const label = selected.value?.meta?.label;
  return label ? magicWriteMap[label] : () => ({ data: ref([]), isFetching: ref(false), refetch: () => {} });
});

const suggestions = ref([]);
const loading = ref(false);
// const query = useMagicWrite.value(editor.adapter.product, editor.adapter.objective);
// console.log(query);

const onChangeActiveTextboxProperty = (value: any) => {
  editor.canvas.onChangeActiveTextboxProperty("text", value);
};

const onGenerateText = async () => {
  // console.log("onGenerateText", selected.value, editor.adapter);
  loading.value = true;
  const label = selected.value?.meta?.label ?? "headline-text";
  const query = magicWriteMap[label];
  const product = {
    name: "Wyze Camera v4",
    description: "Get unmatched security with Wyze Cam v4. Crystal-clear 2.5K QHD resolution, Enhanced Color Night Vision, and motion-activated spotlight keep your home safe day or night. Plus, 24/7 local recording, Wi-Fi 6 support, and compatibility with Alexa and Google Assistant for ultimate convenience. ",
  }
  const res = await query(product, selected.value?.text ?? "Wyze Camera v4");
  console.log(res);
  if(res){
    suggestions.value = res;
  }
  loading.value = false;
}

</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex w-full items-center">
      <el-button type="primary" :icon="RefreshCcw" :loading="loading" text bg round class="inline-flex items-center gap-1 ml-auto" @click="onGenerateText">
        <span>Refresh</span>
      </el-button>
    </div>
    <template v-if="!suggestions || !suggestions.length || loading">
      <template v-if="loading">
        <el-skeleton v-for="(_, index) in 3" :key="index" class="w-full h-8" />
      </template>
      <template v-else>
        <p class="text-destructive text-xs text-center">Unable to generate suggestions</p>
      </template>
    </template>
    <template v-else>
      <div role="button" v-for="(suggestion, index) in suggestions" :key="suggestion + index" tabindex="0" class="text-xs border rounded-md font-medium p-3" @click="onChangeActiveTextboxProperty(suggestion)">
        {{ suggestion }}
      </div>
    </template>
  </div>
</template>