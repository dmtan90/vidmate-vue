<script setup lang="ts">
import { Sun, Moon } from 'lucide-vue-next';
import Button from './button.vue';
import DropdownMenuRoot from './dropdown-menu-root.vue';
import DropdownMenuTrigger from './dropdown-menu-trigger.vue';
import DropdownMenuContent from './dropdown-menu-content.vue';
import DropdownMenuRadioGroup from './dropdown-menu-radio-group.vue';
import DropdownMenuRadioItem from './dropdown-menu-radio-item.vue';
import { useTheme } from '@/hooks/use-theme';

const { theme, setTheme } = useTheme();
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger as-child>
      <Button variant="secondary" size="icon">
        <Sun :size="15" class="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon :size="15" class="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="min-w-32">
      <DropdownMenuRadioGroup v-model="theme" @update:model-value="setTheme">
        <DropdownMenuRadioItem class="text-xs" value="light">
          Light
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem class="text-xs" value="dark">
          Dark
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem class="text-xs" value="system">
          System
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </DropdownMenuContent>
  </DropdownMenuRoot>
</template>
