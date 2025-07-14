<script setup lang="ts">
import { Ban, CircleCheckBig } from 'lucide-vue-next';
import Spinner from '@/components/ui/spinner.vue';
import { ExportProgress } from '@/store/editor';

defineProps<{ progress: ExportProgress }>();
</script>

<template>
  <template v-if="progress === ExportProgress.Error">
    <Ban class="h-4 w-4 text-primary-foreground" />
  </template>
  <template v-else-if="progress === ExportProgress.Completed">
    <CircleCheckBig class="h-4 w-4 text-primary-foreground" />
  </template>
  <template v-else-if="progress === ExportProgress.None">
    <!-- Render nothing -->
  </template>
  <template v-else>
    <Spinner class="h-4 w-4 text-primary-foreground" />
  </template>
</template>