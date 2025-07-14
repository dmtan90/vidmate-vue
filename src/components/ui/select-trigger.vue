<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { SelectTrigger as SelectTriggerRadix, SelectIcon } from 'reka-ui';
import { ChevronsUpDown } from 'lucide-vue-next';
import { cn } from '@/lib/utils';

const props = defineProps({
  class: { type: String, default: '' },
});

const computedClass = computed(() =>
  cn(
    "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
    props.class
  )
);

const attrs = useAttrs();
</script>

<template>
  <SelectTriggerRadix :class="computedClass" v-bind="attrs">
    <slot />
    <SelectIcon as-child>
      <ChevronsUpDown class="h-4 w-4 opacity-50" />
    </SelectIcon>
  </SelectTriggerRadix>
</template>
