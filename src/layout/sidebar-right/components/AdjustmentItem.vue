<script setup lang="ts">
import { computed } from 'vue';
import { PreviewOpen as Eye, PreviewClose as EyeOff } from '@icon-park/vue-next';
import Toggle from '@/components/ui/toggle.vue';
import Label  from '@/components/ui/label.vue';
import { cn } from '@/lib/utils';

const props = defineProps<{ adjustment: any; selected: any; onChange: (value: number) => void; onToggle: (value: boolean) => void }>();

const active = computed(() => !!props.selected?.adjustments?.[props.adjustment.name]);
// const intensity = computed(() => props.selected?.adjustments?.[props.adjustment.name]?.intensity || 0);
const filterValue = computed({
  get(){
    return props.selected?.adjustments?.[props.adjustment.name]?.intensity || 0;
  },

  set(value){
    if(props.onChange){
      props.onChange(value);
    }
  }
});
</script>

<template>
  <div :class="cn('items-center grid grid-cols-12', active ? 'opacity-100' : 'opacity-50')">
    <Label class="text-xs font-medium col-span-5">{{ adjustment.name }}</Label>
    <div class="flex items-center col-span-7 gap-2">
      <Toggle v-model="active" circle class="h-6 w-6 px-0 text-foreground shrink-0" @toggle="(value) => onToggle(value)">
        <template v-if="active">
          <Eye :size="12" />
        </template>
        <template v-else>
          <EyeOff :size="12" />
        </template>
      </Toggle>
      <el-slider :disabled="!active" :min="-100" :max="100" :step="1" v-model="filterValue" />
    </div>
  </div>
</template>
