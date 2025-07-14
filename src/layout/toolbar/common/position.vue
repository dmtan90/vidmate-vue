<script setup lang="ts">
import { BoxSelect } from 'lucide-vue-next';

import Button from '@/components/ui/button.vue';
import DropdownMenuRoot from '@/components/ui/dropdown-menu-root.vue';
import DropdownMenuContent from '@/components/ui/dropdown-menu-content.vue';
import DropdownMenuGroup from '@/components/ui/dropdown-menu-group.vue';
import DropdownMenuItem from '@/components/ui/dropdown-menu-item.vue';
import DropdownMenuLabel from '@/components/ui/dropdown-menu-label.vue';
import DropdownMenuSeparator from '@/components/ui/dropdown-menu-separator.vue';
import DropdownMenuTrigger from '@/components/ui/dropdown-menu-trigger.vue';

import { useEditorStore } from '@/store/editor';
import { align, move } from '@/constants/editor';

const editor = useEditorStore();

const handleMoveLayer = (type: "up" | "down" | "bottom" | "top") => {
  editor.canvas.alignment.changeActiveObjectLayer(type);
};

const handleAlignToPage = (type: "left" | "center" | "right" | "top" | "middle" | "bottom") => {
  editor.canvas.alignment.alignActiveObjecToPage(type);
};

</script>

<template>
  <div class="flex items-center gap-2.5">
    <DropdownMenuRoot>
      <DropdownMenuTrigger as-child>
        <Button variant="outline" size="icon" class="gap-1.5">
          <BoxSelect :size="15" :stroke-width="1.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent class="min-w-48" align="end">
        <DropdownMenuLabel class="text-xs">Move</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem v-for="({ label, value }) in move" :key="value" @click="handleMoveLayer(value)" class="text-xs">
            {{ label }}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel class="text-xs">Align to Page</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem v-for="({ label, value }) in align" :key="value" @click="handleAlignToPage(value)" class="text-xs">
            {{ label }}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenuRoot>
  </div>
</template>
