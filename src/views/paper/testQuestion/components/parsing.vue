<template>
  <div class="parsing-wrapper">
    <span class="component-label">解析</span>
    <h-editor class="h-editor" placeholder="题目解析，点此编辑（必填）" v-model:html="html" />
  </div>
</template>
<script setup lang="ts">
import { defineEmits, ref, watch } from 'vue';
import HEditor from '@/views/components/editor/index.vue';
const html = ref('');
const emit = defineEmits(['update:html']);

watch(html, (value: string) => {
  emit('update:html', value);
});
</script>
<style lang="scss">
.parsing-wrapper {
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
