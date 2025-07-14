<script setup lang="ts">
import { computed, useAttrs, type PropType } from 'vue';
import { CheckboxRoot, CheckboxIndicator } from 'reka-ui';
import { Check } from 'lucide-vue-next';
import { cn } from '@/lib/utils';

const props = defineProps({
  class: { type: String, default: '' },
  checked: { type: [Boolean, String] as PropType<boolean | 'indeterminate' | undefined>, default: undefined },
});

const computedClass = computed(() =>
  cn(
    "peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
    props.class
  )
);

const attrs = useAttrs();
</script>

<template>
  <CheckboxRoot :class="computedClass" :checked="props.checked" v-bind="attrs">
    <CheckboxIndicator class="flex items-center justify-center text-current">
      <Check class="h-4 w-4" />
    </CheckboxIndicator>
  </CheckboxRoot>
</template>
