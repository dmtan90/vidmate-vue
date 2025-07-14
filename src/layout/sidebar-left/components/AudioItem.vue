<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue';
import { Pause, Play } from 'lucide-vue-next';
import { formatMediaDuration } from '@/lib/time';

const props = defineProps<{ audio: any; onClick?: () => void }>();

const audioRef = ref<HTMLAudioElement | null>(null);
const isPlaying = ref(false);

const handlePlay = (event: MouseEvent) => {
  event.stopPropagation();
  if (isPlaying.value) {
    isPlaying.value = false;
    audioRef.value?.pause();
  } else {
    isPlaying.value = true;
    audioRef.value?.play();
  }
};

const handleEnd = () => {
  isPlaying.value = false
};

watch(audioRef, (newAudioRef) => {
  if (newAudioRef) {
    newAudioRef.addEventListener("ended", handleEnd);
  }
});

onUnmounted(() => {
  if(audioRef.value){
    audioRef.value?.removeEventListener("ended", handleEnd);
  }
});


</script>

<template>
  <div class="flex flex-col items-center gap-2">
    <button @click="onClick" class="group shrink-0 h-16 w-20 border overflow-hidden rounded-md shadow-sm relative">
      <img :src="audio.thumbnail" crossOrigin="anonymous" class="h-8 w-full rounded-md transition-transform group-hover:scale-110 object-cover" />
      <div class="absolute hidden group-hover:inline-flex items-center justify-between gap-2 bottom-1 left-1 right-1 text-card bg-foreground/50 pr-1.5 rounded-sm">
        <div role="button" class="px-1.5 py-1 transition-transform hover:scale-125" @click="handlePlay">
          <template v-if="isPlaying">
            <Pause :size="14" class="fill-card" />
          </template>
          <template v-else>
            <Play :size="14" class="fill-card" />
          </template>
        </div>
        <span class="text-xxs font-medium">{{ formatMediaDuration(audio.duration * 1000, false) }}</span>
        <audio ref="audioRef">
          <source :src="audio.source" />
        </audio>
      </div>
    </button>
    <span class="text-xxs font-medium w-20 px-1 mx-auto whitespace-nowrap overflow-hidden text-ellipsis text-center">{{ audio.name }}</span>
  </div>
</template>