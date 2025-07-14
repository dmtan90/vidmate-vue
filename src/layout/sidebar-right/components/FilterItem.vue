<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';
import { filterPlaceholder } from '@/constants/editor';
import Label from '@/components/ui/label.vue';
import FilterSlider from "@/components/slider/filter-slider.vue";

const props = defineProps<{ filter: any; selected: any; onChange: (value: number) => void; onClick: () => void }>();

const active = computed(() => props.selected.effects?.name === props.filter.name);
const intensity = computed(() => props.selected.effects?.intensity || 50);
</script>

<template>
  <template v-if="!active">
    <button :class="cn('h-14 w-full relative rounded-md overflow-hidden group')" @click="onClick">
      <img :src="filterPlaceholder" class="h-full w-full object-cover object-center group-hover:scale-105 transition-transform" />
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-card-foreground" />
      <span class="absolute bottom-1.5 left-2.5 text-card text-xs font-medium">{{ filter.name }}</span>
    </button>
  </template>

  <template v-else>
    <div class="flex flex-col gap-3">
      <button :class="cn('h-14 w-full relative rounded-md overflow-hidden group ring ring-blue-500')" @click="onClick">
        <img :src="filterPlaceholder" class="h-full w-full object-cover object-center group-hover:scale-105 transition-transform" />
        <div class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-card-foreground" />
        <span class="absolute bottom-1 left-2 text-card text-xs font-medium">{{ filter.name }}</span>
      </button>
      <div class="flex items-center justify-between gap-10">
        <Label class="text-xs font-medium">Intensity</Label>
        <FilterSlider :min="1" :max="100" :step="1" :value="[intensity]" @update:model-value="([val]) => onChange(val)" />
      </div>
    </div>
  </template>
</template>
