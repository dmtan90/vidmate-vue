<script setup lang="ts">
import { computed } from 'vue';
import { Eye, EyeOff } from 'lucide-vue-next';
import Toggle from '@/components/ui/toggle.vue';
import Label  from '@/components/ui/label.vue';
import FilterSlider from '@/components/slider/filter.vue';
import { cn } from '@/lib/utils';

const props = defineProps<{ adjustment: any; selected: any; onChange: (value: number) => void; onToggle: (value: boolean) => void }>();

const active = computed(() => !!props.selected?.adjustments?.[props.adjustment.name]);
const intensity = computed(() => props.selected?.adjustments?.[props.adjustment.name]?.intensity || 0);
</script>

<template>
  <div :class="cn('items-center grid grid-cols-12', active ? 'opacity-100' : 'opacity-50')">
    <Label class="text-xs font-medium col-span-5">{{ adjustment.name }}</Label>
    <div class="flex items-center col-span-7 gap-2">
      <Toggle class="h-6 w-6 px-0 text-foreground shrink-0" :pressed="active" @update:pressed="onToggle">
        <template v-if="active">
          <Eye :size="12" />
        </template>
        <template v-else>
          <EyeOff :size="12" />
        </template>
      </Toggle>
      <FilterSlider :disabled="!active" :min="-100" :max="100" :step="1" :value="[intensity]" @update:model-value="([val]) => onChange(val)" />
    </div>
  </div>
</template>
