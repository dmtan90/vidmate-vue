<script setup lang="ts">
import { computed, useAttrs, type PropType } from 'vue';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const props = defineProps({
  variant: {
    type: String as PropType<"default" | "destructive">,
    default: 'default',
  },
  class: {
    type: String,
    default: '',
  },
});

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const computedClass = computed(() =>
  cn(alertVariants({ variant: props.variant }), props.class)
);

const attrs = useAttrs();
</script>

<template>
  <div role="alert" :class="computedClass" v-bind="attrs">
    <slot />
  </div>
</template>
