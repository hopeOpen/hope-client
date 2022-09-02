<template>
  <div class="topic-wrapper">
    <span class="component-label">题干</span>
    <h-editor class="h-editor" placeholder="题干，点此编辑（必填）" v-model:html="htmlValue" />
  </div>
</template>
<script lang="ts">
export default {
  name: 'Editor'
};
</script>
<script setup lang="ts">
import { defineEmits, defineProps, computed } from 'vue';
import HEditor from '@/views/components/editor/index.vue';

const props = defineProps({
  html: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:html']);

const htmlValue = computed({
  get() {
    return props.html;
  },
  set(val: string) {
    emit('update:html', val);
  }
});
</script>
<style lang="scss">
.topic-wrapper {
  display: flex;
}
</style>
