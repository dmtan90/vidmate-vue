<script setup lang="ts">
import { cn } from '@/lib/utils';
import { EditorAnimation } from '@/constants/animations';

const props = defineProps<{ animation: EditorAnimation; selected?: boolean; onClick: () => void }>();
</script>

<template>
  <div class="space-y-0.5">
    <button :class="cn('w-full aspect-square rounded-xl overflow-hidden border', selected ? 'ring-2 ring-primary/50' : 'ring-0')" @click="onClick">
      <img :src="animation.preview" class="h-full w-full" />
    </button>
    <p class="text-xs font-medium text-center text-foreground/60">{{ animation.label }}</p>
  </div>
</template>
