<script setup lang="ts">
import { Box, Circle, Image, Music, RectangleHorizontal, Triangle, Type, Video, ChartArea } from 'lucide-vue-next';

defineProps<{ type?: string; name?: string }>();
// console.log(type, name);
</script>

<template>
  <div v-if="type === 'text' || type === 'textbox'" class="inline-flex items-center gap-1.5">
    <Type :size="12" />
    <span class="text-xxs">Text</span>
  </div>
  <div v-else-if="type === 'video'" class="inline-flex items-center gap-1.5">
    <Video :size="12" />
    <span class="text-xxs">Video</span>
  </div>
  <div v-else-if="type === 'image'" class="inline-flex items-center gap-1.5">
    <Image :size="12" />
    <span class="text-xxs">Image</span>
  </div>
  <div v-else-if="type === 'triangle'" class="inline-flex items-center gap-1.5">
    <Triangle :size="12" />
    <span class="text-xxs">Triangle</span>
  </div>
  <div v-else-if="type === 'rect'" class="inline-flex items-center gap-1.5">
    <RectangleHorizontal :size="12" />
    <span class="text-xxs">Rectangle</span>
  </div>
  <div v-else-if="type === 'ellipse' || type === 'circle'" class="inline-flex items-center gap-1.5">
    <Circle :size="12" />
    <span class="text-xxs">Ellipse</span>
  </div>
  <div v-else-if="type === 'path' || type === 'line' || type === 'polygon' || type === 'polyline'" class="inline-flex items-center gap-1.5">
    <Box :size="12" />
    <span class="text-xxs">{{ name?.split("_").at(0) || "Shape" }}</span>
  </div>
  <div v-else-if="type === 'audio'" class="inline-flex items-center gap-1.5">
    <Music :size="12" />
    <span class="text-xxs">Audio</span>
  </div>
  <div v-else-if="type === 'chart'" class="inline-flex items-center gap-1.5">
    <ChartArea :size="12" />
    <span class="text-xxs">Chart</span>
  </div>
</template>
