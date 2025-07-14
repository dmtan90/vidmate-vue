<script setup lang="ts">
import { computed, watch } from 'vue';
import { upperFirst } from 'lodash';
import { ChevronUp } from 'lucide-vue-next';

import Button from '@/components/ui/button.vue';
import Input from '@/components/ui/input.vue';
import Label from '@/components/ui/label.vue';
import SelectRoot from '@/components/ui/select-root.vue';
import SelectContent from '@/components/ui/select-content.vue';
import SelectItem from '@/components/ui/select-item.vue';
import SelectTrigger from '@/components/ui/select-trigger.vue';
import SelectValue from '@/components/ui/select-value.vue';
import PopoverRoot from '@/components/ui/popover-root.vue';
import PopoverContent from '@/components/ui/popover-content.vue';
import PopoverTrigger from '@/components/ui/popover-trigger.vue';
import Slider from '@/components/ui/slider.vue';

import { useAnimationControls } from '@/layout/sidebar-right/hooks/use-animation-controls';

import { cn } from '@/lib/utils';
import { EditorAnimation, defaultSpringConfig, easings } from '@/constants/animations';
import { FabricUtils } from '@/fabric/utils';
import { calculateSpringAnimationDuration, visualizeSpringAnimation } from '@/lib/animations';

const props = defineProps<{ selected: fabric.Object; type: "in" | "out" | "scene"; animations: EditorAnimation[] }>();

const controls = useAnimationControls(props.selected, props.type);
const animation = computed(() => props.animations.find((anim) => anim.value === props.selected.anim?.[props.type]?.name));

const spring = computed(() => {
  const config = props.selected.anim?.[props.type]?.config || defaultSpringConfig;
  return { graph: visualizeSpringAnimation(config), duration: calculateSpringAnimationDuration(config) };
});

const text = computed({
  get: () => {
    return props.selected.anim?.[props.type]?.text || "letter";
  },

  set: (value) => {
    console.log(value);
    controls.changeTextAnimate(value);
  }
});
const easing = computed({
  get: () => {
    return props.selected.anim?.[props.type]?.easing || "linear";
  },

  set: (value) => {
    console.log(value);
    controls.changeEasing(value);
  }
});

const duration = computed({
  get: () => {
    return (props.selected.anim?.[props.type]?.duration || 0) / 1000;
  },

  set: (value) => {
    console.log(value);
    controls.changeDuration(value);
  }
});
const physics = computed(() => props.selected.anim?.[props.type]?.config || defaultSpringConfig);
const disabled = computed(() => !props.selected.anim?.[props.type]?.name || props.selected.anim?.[props.type]?.name === "none");

watch(props, () => {
  console.log("props", props);
  animation; spring; text; easing; duration; physics; disabled;
});

</script>

<template>
  <div class="flex flex-col">
    <div class="flex items-center justify-between gap-6">
      <Label :class="cn('text-xs shrink-0', disabled || animation?.disabled?.easing ? 'opacity-50' : 'opacity-100')">Easing</Label>
      <SelectRoot v-model="easing" :disabled="disabled || animation?.disabled?.easing">
        <SelectTrigger class="h-8 text-xs w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="e in easings" :key="e.value" class="text-xs" :value="e.value">
            {{ e.label }}
          </SelectItem>
        </SelectContent>
      </SelectRoot>
    </div>
    <template v-if="easing !== 'spring'">
      <div class="flex items-center justify-between gap-6 mt-3">
        <Label :class="cn('text-xs shrink-0', disabled || animation?.disabled?.duration ? 'opacity-50' : 'opacity-100')">Duration (s)</Label>
        <Input :value="duration" :disabled="disabled || animation?.disabled?.duration" type="number" :step="0.1" class="text-xs h-8 w-40" />
      </div>
    </template>
    <template v-else>
      <div class="flex items-center justify-between gap-6 mt-3">
        <Label :class="cn('text-xs shrink-0', disabled ? 'opacity-50' : 'opacity-100')">Physics</Label>
        <PopoverRoot>
          <PopoverTrigger as-child>
            <Button size="sm" variant="outline" class="h-8 w-40 justify-between items-center">
              <img :src="spring.graph" class="h-8 w-auto -scale-y-100" />
              <ChevronUp class="w-4 h-4 opacity-50 shrink-0" />
            </Button>
          </PopoverTrigger>
          <PopoverContent @open-auto-focus.prevent class="w-64 flex flex-col" align="end">
            <div class="bg-transparent-pattern rounded-sm overflow-hidden relative p-2">
              <span class="absolute bottom-2 right-2 text-center text-xxs w-fit font-medium">Approximate Duration: {{ (spring.duration / 1000).toFixed(2) }} seconds</span>
              <img :src="spring.graph" class="h-full w-auto -scale-y-100" />
            </div>
            <Label class="text-xs font-medium mt-6">Mass</Label>
            <div class="flex items-center justify-between gap-4">
              <Slider :min="1" :max="100" :value="[physics.mass]" @update:model-value="([mass]) => controls.changePhysics({ mass })" />
              <Input
                type="number"
                :min="1"
                :max="100"
                :value="physics.mass"
                @update:model-value="(value) => (+value < 1 || +value > 100 ? null : controls.changePhysics({ mass: +value }))"
                class="h-8 w-20 text-xs"
              />
            </div>
            <Label class="text-xs font-medium mt-4">Stiffness</Label>
            <div class="flex items-center justify-between gap-4">
              <Slider :min="1" :max="100" :value="[physics.stiffness]" @update:model-value="([stiffness]) => controls.changePhysics({ stiffness })" />
              <Input
                type="number"
                :min="1"
                :max="100"
                :value="physics.stiffness"
                @update:model-value="(value) => (+value < 1 || +value > 100 ? null : controls.changePhysics({ stiffness: +value }))"
                class="h-8 w-20 text-xs"
              />
            </div>
            <Label class="text-xs font-medium mt-4">Damping</Label>
            <div class="flex items-center justify-between gap-4">
              <Slider :min="1" :max="100" :value="[physics.damping]" @update:model-value="([damping]) => controls.changePhysics({ damping })" />
              <Input
                type="number"
                :min="1"
                :max="100"
                :value="physics.damping"
                @update:model-value="(value) => (+value < 1 || +value > 100 ? null : controls.changePhysics({ damping: +value }))"
                class="h-8 w-20 text-xs"
              />
            </div>
            <Label class="text-xs font-medium mt-4">Velocity</Label>
            <div class="flex items-center justify-between gap-4">
              <Slider :min="0" :max="100" :value="[physics.velocity]" @update:model-value="([velocity]) => controls.changePhysics({ velocity })" />
              <Input
                type="number"
                :min="0"
                :max="100"
                :value="physics.velocity"
                @update:model-value="(value) => (+value < 0 || +value > 100 ? null : controls.changePhysics({ velocity: +value }))"
                class="h-8 w-20 text-xs"
              />
            </div>
          </PopoverContent>
        </PopoverRoot>
      </div>
    </template>
    <div v-if="FabricUtils.isTextboxElement(selected)" class="flex items-center justify-between gap-6 mt-3">
      <Label :class="cn('text-xs shrink-0', disabled || animation?.disabled?.text ? 'opacity-50' : 'opacity-100')">Text Animate</Label>
      <SelectRoot v-model="text" :disabled="disabled || animation?.disabled?.text || animation?.type !== 'textbox'">
        <SelectTrigger class="h-8 text-xs w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="type in ['letter', 'word', 'line']" :key="type" class="text-xs" :value="type">
            {{ upperFirst(type) }}
          </SelectItem>
        </SelectContent>
      </SelectRoot>
    </div>
  </div>
</template>
