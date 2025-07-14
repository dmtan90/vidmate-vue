<script setup lang="ts">
import { ExportProgress } from '@/store/editor';

defineProps<{ progress: ExportProgress }>();
</script>

<template>
  <template v-if="progress === ExportProgress.Error">
    <span class="text-xxs text-primary-foreground">Error</span>
  </template>
  <template v-else-if="progress === ExportProgress.Completed">
    <span class="text-xxs text-primary-foreground">Completed</span>
  </template>
  <template v-else-if="progress === ExportProgress.CaptureAudio">
    <span class="text-xxs text-primary-foreground">In Progress - Capturing Audio</span>
  </template>
  <template v-else-if="progress === ExportProgress.CaptureVideo">
    <span class="text-xxs text-primary-foreground">In Progress - Capturing Video</span>
  </template>
  <template v-else-if="progress === ExportProgress.CompileVideo">
    <span class="text-xxs text-primary-foreground">In Progress - Compiling Media</span>
  </template>
  <template v-else>
    <!-- Render nothing -->
  </template>
</template>