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
  .component-label {
    width: 44px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    background: #f1f3f8;
    font-size: 12px;
    color: #656577;
    margin-right: 16px;
    position: relative;
    top: 10px;
  }
}
</style>
