<script setup lang="ts">
import Slider from '@/components/ui/slider.vue';

const props = defineProps({
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  step: { type: Number, default: 1 },
  modelValue: { type: Array as () => number[], default: () => [0] },
  disabled: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue']);

const onValueChange = (value: number[]) => {
  emit('update:modelValue', value);
};
</script>

<template>
  <Slider
    :min="min"
    :max="max"
    :step="step"
    :value="modelValue"
    :disabled="disabled"
    @update:model-value="onValueChange"
    class="w-[60%]"
  />
</template>
