<script setup lang="ts">
import { computed, ref, watch, reactive } from 'vue';
import { clamp } from 'lodash';
import { Motion, AnimatePresence } from 'motion-v'
import { CheckIcon, CopyPlusIcon, GroupIcon, LinkIcon, PencilIcon, RepeatIcon, SendToBackIcon, SparklesIcon, Trash2Icon } from 'lucide-vue-next';

import Button from '@/components/ui/button.vue';
import { useEditorStore } from '@/store/editor';
import { FabricUtils } from '@/fabric/utils';
import { storeToRefs } from "pinia"
import { useCanvasStore } from "@/store/canvas";
import DropdownMenuRoot from '@/components/ui/dropdown-menu-root.vue';
import DropdownMenuContent from '@/components/ui/dropdown-menu-content.vue';
import DropdownMenuGroup from '@/components/ui/dropdown-menu-group.vue';
import DropdownMenuItem from '@/components/ui/dropdown-menu-item.vue';
import DropdownMenuRadioGroup from '@/components/ui/dropdown-menu-radio-group.vue';
import DropdownMenuRadioItem from '@/components/ui/dropdown-menu-radio-item.vue';
import DropdownMenuLabel from '@/components/ui/dropdown-menu-label.vue';
import DropdownMenuSeparator from '@/components/ui/dropdown-menu-separator.vue';
import DropdownMenuTrigger from '@/components/ui/dropdown-menu-trigger.vue';
import DropdownMenuCheckboxItem from '@/components/ui/dropdown-menu-checkbox-item.vue';

import { align, move, placeholders } from '@/constants/editor';
import { cn } from '@/lib/utils';

const MENU_OFFSET_Y = 60;

const editor = useEditorStore();
const canvasStore = useCanvasStore();
const { mode } = storeToRefs(editor);
const { canvas, selection, workspace, instance } = storeToRefs(canvasStore);
// const canvas = editor.canvas;
const style = reactive({
  top: '0px',
  left: '0px'
});

canvasStore.$subscribe((mutation, state) => {
  computeStyle();
});

const active = computed(() => selection?.value?.active);

const computeStyle = () => {
  const selected = instance.value.getActiveObject();
  // const selected = active.value;
  if (!selected || !workspace.value || !instance.value) return;

  const viewport = workspace.value.viewportTransform;

  if (!viewport) return {};

  const offsetX = viewport[4];
  const offsetY = viewport[5];

  const top = offsetY + selected.getBoundingRect(true).top * workspace.value.zoom - MENU_OFFSET_Y;
  const left = offsetX + selected.getBoundingRect(true).left * workspace.value.zoom + ((selected.width * selected.scaleX) / 2) * workspace.value.zoom;
  style.top = `${clamp(top, MENU_OFFSET_Y / 4, instance.value.height - MENU_OFFSET_Y)}px`
  style.left = `${clamp(left, MENU_OFFSET_Y * 2.5, instance.value.width - MENU_OFFSET_Y * 2.5)}px`
};

const handleReplaceObject = () => {
  if (canvas.value.replacer.active) {
    canvas.value.replacer.mark(null);
  } else {
    const replace = canvas.value.replacer.mark(instance.value.getActiveObject());
    if (replace) editor.setActiveSidebarLeft(`${replace.type}s`);
  }
};

const showControls = computed(() => {
  return (
    active.value &&
    workspace.value &&
    canvas.value.controls &&
    !canvas.value?.cropper.active &&
    active.value.type !== "audio" && active.value.type !== "chart"
  );
});

</script>

<template>
  <AnimatePresence>
    <Motion
      :initial="{ opacity: 0 }" :animate="{ opacity: 1 }" :exit="{ opacity: 0 }"
      v-if="showControls"
      :style="style"
      class="absolute border bg-popover text-popover-foreground shadow rounded-md outline-none items-center divide-x flex -translate-x-1/2 z-20"
    >
      <div v-if="active.meta?.group" class="flex items-center p-1">
        <Button size="sm" variant="ghost" class="gap-1.5 rounded-sm h-7 px-2" @click="selection.selectMetaGroup(active.meta.group)">
          <GroupIcon :size="14" />
          <span>Select Group</span>
        </Button>
      </div>

      <div v-if="(active.type === 'textbox' || active.type === 'image')" class="flex items-center p-1">
        <Button size="sm" variant="ghost" class="gap-1.5 rounded-sm h-7 px-2" @click="editor.setActiveSidebarRight('ai')">
          <SparklesIcon :size="14" />
          <span>AI Magic</span>
        </Button>
      </div>

      <div v-if="FabricUtils.isTextboxElement(active)" class="flex items-center p-1">
        <Button
          v-if="active.isEditing"
          size="sm"
          variant="ghost"
          class="gap-1.5 rounded-sm h-7 px-2"
          @click="canvas.onExitActiveTextboxEdit()"
        >
          <CheckIcon :size="14" />
          <span>Finish</span>
        </Button>
        <Button
          v-else
          size="sm"
          variant="ghost"
          class="gap-1.5 rounded-sm h-7 px-2"
          @click="canvas.onEnterActiveTextboxEdit()"
        >
          <PencilIcon :size="14" />
          <span>Edit</span>
        </Button>
      </div>

      <div v-else-if="active.type === 'image' || active.type === 'video'" class="flex items-center p-1" @click="handleReplaceObject">
        <Button size="sm" :variant="canvas.replacer.active ? 'default' : 'ghost'" class="gap-1.5 rounded-sm h-7 px-2 transition-none">
          <RepeatIcon :size="14" />
          <span>Replace</span>
        </Button>
      </div>

      <div v-if="mode === 'creator'" class="flex items-center p-1">
        <DropdownMenuRoot :modal="false">
          <DropdownMenuTrigger as-child>
            <Button variant="ghost" size="sm" :class="cn('gap-1.5 rounded-sm h-7 px-2 transition-none', active.meta?.label ? 'bg-violet-600 text-white hover:bg-violet-700 hover:text-white' : 'bg-transparent')">
              <LinkIcon :size="14" />
              <span>Placeholder</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" :side-offset="6">
            <DropdownMenuCheckboxItem
              v-for="placeholder in placeholders"
              :key="placeholder.value"
              :checked="active.meta?.label === placeholder.value"
              @update:checked="(value) => canvas.onMarkActiveObjectAsPlaceholder(!value ? false : placeholder.value)"
              class="text-xs"
            >
              {{ placeholder.label }}
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenuRoot>
      </div>

      <div class="flex items-center gap-1 p-1">
        <Button size="icon" variant="ghost" class="rounded-sm h-7 w-7" @click="canvas.cloner.clone()" :disabled="active.meta?.thumbnail">
          <CopyPlusIcon :size="14" />
        </Button>
        <Button size="icon" variant="ghost" class="rounded-sm h-7 w-7" @click="canvas.onDeleteActiveObject()">
          <Trash2Icon :size="14" />
        </Button>
      </div>

      <div class="flex items-center gap-1 p-1">
        <DropdownMenuRoot :modal="false">
          <DropdownMenuTrigger as-child>
            <Button size="icon" variant="ghost" class="rounded-sm h-7 w-7">
              <SendToBackIcon :size="14" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent class="min-w-40" align="end" :side-offset="6" :align-offset="-4">
            <DropdownMenuLabel class="text-xs">Move</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem
                v-for="({ label, value }) in move"
                :key="value"
                @click="canvas.alignment.changeActiveObjectLayer(value)"
                class="text-xs"
              >
                {{ label }}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuLabel class="text-xs">Align to Page</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem
                v-for="({ label, value }) in align"
                :key="value"
                @click="canvas.alignment.alignActiveObjecToPage(value)"
                class="text-xs"
              >
                {{ label }}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenuRoot>
      </div>
    </Motion>
  </AnimatePresence>
</template>
