<script setup lang="ts">
import BGRemovalPlugin from '@/components/ai/bg-removal.vue';
import MagicWritePlugin from '@/components/ai/magic-write.vue';

interface AISelectPluginProps {
  plugin: string;
  onSelectPlugin: (plugin: string, label: string) => void;
}

const props = defineProps<AISelectPluginProps>();
</script>

<template>
  <template v-if="props.plugin === 'bg-removal'">
    <BGRemovalPlugin />
  </template>
  <template v-else-if="props.plugin === 'magic-write'">
    <MagicWritePlugin />
  </template>
  <template v-else>
    <!-- Render nothing -->
  </template>
</template>
