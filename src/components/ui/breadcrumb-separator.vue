<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-vue-next';

const props = defineProps({
  class: { type: String, default: '' },
});

const computedClass = computed(() =>
  cn("[&>svg]:size-3.5", props.class)
);

const attrs = useAttrs();
</script>

<template>
  <li role="presentation" aria-hidden="true" :class="computedClass" v-bind="attrs">
    <slot>
      <ChevronRight />
    </slot>
  </li>
</template>
