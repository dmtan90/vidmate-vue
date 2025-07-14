<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { Command as CommandPrimitive } from 'vue-command-palette';
import { Search } from 'lucide-vue-next';
import { cn } from '@/lib/utils';

const props = defineProps({
  class: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  modelValue: { type: String, default: '' },
});

const computedClass = computed(() =>
  cn(
    "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
    props.class
  )
);

const attrs = useAttrs();
</script>

<template>
  <div class="flex items-center border-b px-3" cmdk-input-wrapper="">
    <Search class="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <CommandPrimitive.Input :class="computedClass" :placeholder="props.placeholder" :value="props.modelValue" v-bind="attrs" />
  </div>
</template>