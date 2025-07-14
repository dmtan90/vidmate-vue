<script setup lang="ts">
import { computed, useAttrs, ref, watch } from 'vue';
import { cn } from '@/lib/utils';

// const modelValue = defineModel();
const props = defineProps({
  type: { type: String, default: 'text' },
  class: { type: String, default: '' }
});

const computedClass = computed(() =>
  cn(
    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
    props.class
  )
);

const attrs = useAttrs();
// const modelValue = ref(props.value);
// watch(props, (value) => {
//   console.log("props", props);
//   modelValue.value = props.value;
// });
</script>

<template>
  <input :type="props.type" :class="computedClass" v-bind="attrs" />
</template>
