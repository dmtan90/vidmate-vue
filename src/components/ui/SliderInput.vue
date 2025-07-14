<script setup lang="ts">
import { computed, useAttrs, ref, watch, type PropType } from 'vue';
import Slider from './slider.vue';
import Input from './input.vue';

const props = defineProps({
  value: { type: Number, default: 0 },
  class: { type: String, default: '' },
  min: { type: Number, default: null },
  max: { type: Number, default: null },
  step: { type: Number, default: null },
  disabled: { type: Boolean, default: false },
  onChange: { type: Function, default: (value) => {} }
});

// const computedClass = computed(() =>
//   cn("relative flex w-full touch-none select-none items-center data-[disabled]:pointer-events-none data-[disabled]:opacity-50", props.class)
// );

// const attrs = useAttrs();

// const modelValue = ref(props.value);
// watch(props, (value) => {
//   console.log("props", value);
//   modelValue.value = props.value;
// });

</script>

<template>
  <Slider :min="props.min" :max="props.max" :step="props.step" :value="[props.value]" :disabled="props.disabled" @update:model-value="([value]) => props.onChange(value)"/>
  <Input
    type="number"
    class="h-8 w-16 text-xs"
    :value="props.value"
    :disabled="props.disabled"
    @change="(event) => props.onChange(Number(event.target.value))"
    :min="props.min" :max="props.max" :step="props.step"
  />
</template>
