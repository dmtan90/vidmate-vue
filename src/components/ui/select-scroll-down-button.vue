<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { SelectScrollDownButton as SelectScrollDownButtonRadix } from 'reka-ui';
import { ChevronDown } from 'lucide-vue-next';
import { cn } from '@/lib/utils';

const props = defineProps({
  class: { type: String, default: '' },
});

const computedClass = computed(() =>
  cn("flex cursor-default items-center justify-center py-1", props.class)
);

const attrs = useAttrs();
</script>

<template>
  <SelectScrollDownButtonRadix :class="computedClass" v-bind="attrs">
    <ChevronDown />
  </SelectScrollDownButtonRadix>
</template>
