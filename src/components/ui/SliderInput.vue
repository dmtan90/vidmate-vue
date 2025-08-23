<script setup lang="ts">
import { computed, useAttrs, ref, watch, type PropType } from 'vue';

const props = defineProps({
  modelValue: { type: Number, default: 0 },
  class: { type: String, default: '' },
  min: { type: Number, default: null },
  max: { type: Number, default: null },
  step: { type: Number, default: null },
  disabled: { type: Boolean, default: false },
  size: { type: String, default: '' }
});

const emit = defineEmits(['update:modelValue']);

const handleSliderChange = (value: number) => {
  emit('update:modelValue', value);
};

const handleInputChange = (value: string | number) => {
  emit('update:modelValue', Number(value));
};
</script>

<template>
  <el-slider :size="props.size" :min="props.min" :max="props.max" :step="props.step" :model-value="props.modelValue" :disabled="props.disabled" @update:model-value="handleSliderChange"/>
  <el-input-number :size="props.size"
    controls-position="right"
    class="ml-1 h-8 w-30 text-xs [&_.el-input__wrapper]:pl-5"
    :model-value="props.modelValue"
    :disabled="props.disabled"
    @update:model-value="handleInputChange"
    :min="props.min" :max="props.max" :step="props.step"
  />
</template>

<style>
.el-input-number {
  .el-input__wrapper {
    padding-left: 3px !important;
  }
}
</style>