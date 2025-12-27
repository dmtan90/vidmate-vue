<script setup lang="ts">
import { computed, watch } from 'vue';
import { cn } from '@/lib/utils';
import { filterPlaceholder } from '@/constants/editor';
import Label from '@/components/ui/label.vue';
import { useCanvasStore } from '@/store/canvas';
import { storeToRefs } from "pinia";
const canvasStore = useCanvasStore();
const { instance } = storeToRefs(canvasStore);

const props = defineProps<{ filter: any; selected: any; onChange: (value: number) => void; onClick: () => void }>();

const active = computed(() => props.selected.effects?.name === props.filter.name);
const intensity = computed(() => props.selected.effects?.intensity || 50);
// const image = computed(() => props.selected?.src ?? props.selected?.url);
const image = computed({
  get(){
    let url = props.selected?.src;
    let object = props.selected;
    if(object.type == "video"){
      url = props.selected?.thumbnail;
      if(url){
        return url;
      }
      const _object = instance.value.getItemByName(object.name);
      // console.log("video", _object);
      if(_object){
        url = _object.getThumbnail();
      }
    }
    return url;
  }
});
const filterValue = computed({
  get(){
    return props.selected.effects?.intensity || 50
  },

  set(value){
    if(props.onChange){
      props.onChange(value);
    }
  }
});

// watch(props, (value) => {
//   if(props.filter.name == "None"){
//     console.log(props.selected, props.filter);
//   }
// });

</script>

<template>
  <button :class="cn('image-filter h-[109px] w-full relative rounded-lg overflow-hidden', active ? 'active' : '', filter.value ? filter.value : '')" @click="onClick">
    <img :src="image" class="h-full w-full rounded-lg object-cover object-center group-hover:scale-105 transition-transform" />
    <div class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-card-foreground" />
    <span class="absolute bottom-1.5 left-2.5 text-card text-xs font-medium">{{ filter.name }}</span>
  </button>
</template>

<style>
.image-filter {
  &.active {
    outline: 2px solid var(--el-color-primary) !important;
    outline-offset: 2px;
  }
}
</style>