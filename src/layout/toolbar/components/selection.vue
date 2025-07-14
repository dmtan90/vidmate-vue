<script setup lang="ts">
import { Blend } from 'lucide-vue-next';
import Button from '@/components/ui/button.vue';

</script>

<template>
  <div class="flex items-center h-full w-full overflow-x-scroll scrollbar-hidden">
    <Button size="sm" variant="outline" class="gap-1.5">
      <Blend :size="15" />
      <span>Combine</span>
    </Button>
  </div>
</template>
