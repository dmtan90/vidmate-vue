<script setup lang="ts">
import { computed, ref } from 'vue';
import { useMutation } from '@tanstack/vue-query';
import { toast } from 'vue-sonner';

import { Plus, Search } from 'lucide-vue-next';
import Button from '@/components/ui/button.vue';
import Input from '@/components/ui/input.vue';
import Label from '@/components/ui/label.vue';
import TabsRoot from '@/components/ui/tabs-root.vue';
import TabsList from '@/components/ui/tabs-list.vue';
import TabsTrigger from '@/components/ui/tabs-trigger.vue';
import Textarea from '@/components/ui/textarea.vue';

import { useEditorStore } from '@/store/editor';
import { createAdsFromPrompt as createAdsFromPromptApi } from '@/api/prompt';
import { PromptSession } from '@/types/prompt';

const editor = useEditorStore();

const format = ref("banner");
const prompt = ref("Generate an ad for Nike Running Shoes");

const createAdsFromPrompt = useMutation({
  mutationFn: async ({ prompt, format }: { prompt: string; format: string }) => {
    const result = await createAdsFromPromptApi(prompt, format);
    await editor.prompter.createSceneFromPromptSession(result);
  },
});

const handleCreateVideo = () => {
  const promise = createAdsFromPrompt.mutateAsync({ prompt: prompt.value, format: format.value });
  toast.promise(promise, { loading: "Generating your video ads...", success: "Your video ads is generated", error: "Ran into an error while generating your ads" });
};
</script>

<template>
  <section class="sidebar-container py-4 px-3.5">
    <div class="flex flex-col gap-4">
      <div class="space-y-1.5">
        <Label class="text-xs text-foreground/75">Which format do you want?</Label>
        <TabsRoot :value="format" @update:model-value="format = $event">
          <TabsList class="w-full grid grid-cols-3">
            <TabsTrigger value="feed" class="h-full gap-1.5" disabled>
              <span class="text-xs">Feed</span>
            </TabsTrigger>
            <TabsTrigger value="story" class="h-full gap-1.5" disabled>
              <span class="text-xs">Story</span>
            </TabsTrigger>
            <TabsTrigger value="banner" class="h-full gap-1.5">
              <span class="text-xs">Banner</span>
            </TabsTrigger>
          </TabsList>
        </TabsRoot>
      </div>
      <div class="space-y-1.5">
        <Label class="text-xs text-foreground/75">Provide topic with detailed instructions</Label>
        <Textarea class="text-xs min-h-20 h-24 max-h-40" readonly :value="prompt" @update:model-value="prompt = $event" />
      </div>
    </div>
    <Button size="sm" class="w-full mt-6" @click="handleCreateVideo" disabled>
      Coming Soon
    </Button>
  </section>
</template>