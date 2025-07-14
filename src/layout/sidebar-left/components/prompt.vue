<script setup lang="ts">
import { computed, ref } from 'vue';
import { X } from 'lucide-vue-next';

import Button from '@/components/ui/button.vue';

import { useEditorStore } from '@/store/editor';

import CreatePrompt from './CreatePrompt.vue';
import PromptSessions from './PromptSessions.vue';

const editor = useEditorStore();
const mode = ref("edit");

const handleClose = () => {
  if (mode.value === "add") {
    mode.value = "edit";
  } else {
    editor.setActiveSidebarLeft(null);
  }
};

</script>

<template>
  <div class="h-full w-full">
    <div class="flex items-center justify-between h-14 border-b px-4">
      <h2 class="font-semibold">Prompts</h2>
      <Button size="icon" variant="outline" class="bg-card h-7 w-7" @click="handleClose">
        <X :size="16" />
      </Button>
    </div>
    <template v-if="!editor.prompter.hasSessions || mode === 'add'">
      <CreatePrompt />
    </template>
    <template v-else>
      <PromptSessions @create-session="mode = 'add'" />
    </template>
  </div>
</template>