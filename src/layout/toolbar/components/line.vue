<script setup lang="ts">
import Separator from '@/components/ui/separator.vue';

import ToolbarStrokeOption from '../common/stroke.vue';
import ToolbarTimelineOption from '../common/timeline.vue';
import ToolbarOpacityOption from '../common/opacity.vue';

</script>

<template>
  <div class="flex items-center h-full w-full overflow-x-scroll scrollbar-hidden">
    <ToolbarStrokeOption />
    <Separator orientation="vertical" class="h-8 mx-4" />
    <ToolbarOpacityOption />
    <Separator orientation="vertical" class="h-8 mr-4" />
    <ToolbarTimelineOption />
  </div>
</template>