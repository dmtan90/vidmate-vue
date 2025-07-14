<script setup lang="ts">
import { computed, ref } from 'vue';
import { RefreshCcw } from 'lucide-vue-next';

import { useEditorStore } from '@/store/editor';
import Skeleton from '@/components/ui/skeleton.vue';
import { useGenerateCTASuggestions, useGenerateDescriptionSuggestions, useGenerateHeadlineSuggestions } from '@/api/ai';
import { cn } from '@/lib/utils';

import Button from '@/components/ui/button.vue';

// Placeholder for AISelectPluginProps
interface AISelectPluginProps {}

// Placeholder for fabric.Textbox type
interface FabricTextbox {
  meta?: { label: string };
  // Add other properties as needed
}

type QueryFunction = typeof useGenerateCTASuggestions;

const magicWriteMap: Record<string, QueryFunction> = {
  "cta-text": useGenerateCTASuggestions,
  "headline-text": useGenerateHeadlineSuggestions,
  "description-text": useGenerateDescriptionSuggestions,
};

const props = defineProps<AISelectPluginProps>();

const editor = useEditorStore();
const selected = computed(() => editor.canvas.selection.active as FabricTextbox);

const useMagicWrite = computed(() => {
  const label = selected.value?.meta?.label;
  return label ? magicWriteMap[label] : () => ({ data: ref([]), isFetching: ref(false), refetch: () => {} });
});

const query = useMagicWrite.value(editor.adapter.product, editor.adapter.objective);

const onChangeActiveTextboxProperty = (property: string, value: any) => {
  console.log(`Changing textbox property ${property} to ${value}`);
  // Placeholder for actual logic to change textbox property
};

</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex w-full items-center">
      <Button class="text-xs text-primary inline-flex items-center gap-1 ml-auto" :disabled="query.isFetching.value" @click="query.refetch()">
        <span :class="cn(query.isFetching.value ? 'animate-spin' : 'animate-none')">
          <RefreshCcw :size="12" />
        </span>
        <span>Refresh</span>
      </Button>
    </div>
    <template v-if="!query.data.value || !query.data.value.length">
      <template v-if="query.isFetching.value">
        <Skeleton v-for="(_, index) in 3" :key="index" class="w-full h-8" />
      </template>
      <template v-else>
        <p class="text-destructive text-xs text-center">Unable to generate suggestions</p>
      </template>
    </template>
    <template v-else>
      <div role="button" v-for="(suggestion, index) in query.data.value" :key="suggestion + index" tabindex="0" class="text-xs border rounded-md font-medium p-3" @click="onChangeActiveTextboxProperty('text', suggestion)">
        {{ suggestion }}
      </div>
    </template>
  </div>
</template>