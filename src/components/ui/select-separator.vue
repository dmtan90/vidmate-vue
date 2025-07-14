<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { SelectSeparator as SelectSeparatorRadix } from 'reka-ui';
import { cn } from '@/lib/utils';

const props = defineProps({
  class: { type: String, default: '' },
});

const computedClass = computed(() =>
  cn("-mx-1 my-1 h-px bg-muted", props.class)
);

const attrs = useAttrs();
</script>

<template>
  <SelectSeparatorRadix :class="computedClass" v-bind="attrs">
    <slot />
  </SelectSeparatorRadix>
</template>
