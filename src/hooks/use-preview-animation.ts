import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { useEditorStore } from "@/store/editor";
import { debounce } from "lodash";
import { useCanvasStore } from "@/store/canvas";
import { storeToRefs } from "pinia";

export function usePreviewAnimation(element, type) {
  console.log("usePreviewAnimation", element);
  let object = null;
  let anim = JSON.stringify(element?.anim ?? {});
  const editor = useEditorStore();
  const canvasStore = useCanvasStore();
  const { animations, selectionActive: active, instance } = storeToRefs(canvasStore);

  const previewAnimation = debounce((obj) => {
    // console.log("previewAnimation");
    animations.value.dispose(obj);
    if (obj) animations.value.preview(obj, type, obj.anim);
  }, 250);

  const destroy = () => {
    // console.log("destroy");
    previewAnimation.cancel();
    animations.value.dispose(object);
    object = null;
  };

  onMounted(() => {
    console.log("onMounted");
    object = instance.value.getItemByName(element.name);
    previewAnimation(object);
  });

  watch(active, (value) => {
    if(active.value && anim != JSON.stringify(active.value.anim)){
      anim = JSON.stringify(active.value.anim);
      // destroy();
      object = instance.value.getItemByName(active.value.name);
      previewAnimation(object);
    }
  });

  onBeforeUnmount(() => {
    destroy();
  });
}