<template>
  <div class="input-content__block">
    <span class="component-label">答案</span>
    <div class="answers-wrapper">
      <h-editor class="h-editor" :placeholder="placeholder" v-model:html="correctOptionValue" />
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: 'QuestionAnswer'
};
</script>
<script setup lang="ts">
import HEditor from '@/views/components/editor/index.vue';
import { defineProps, computed, defineEmits } from 'vue';
const emit = defineEmits(['update:correctOption']);
const props = defineProps<{
  correctOption: string;
}>();
const placeholder = '点此编辑 (必填)';
const correctOptionValue = computed({
  get() {
    return props.correctOption;
  },
  set(val) {
    emit('update:correctOption', val);
  }
});
</script>
<style lang="scss">
.input-content__block {
  display: flex;
  .answers-wrapper {
    flex: 1;
    border-top: 1px dashed #dcdfe6;
    border-bottom: 1px dashed #dcdfe6;
    padding: 12px 0;
    margin-bottom: 12px;
    .editor-wrapper {
      min-height: 100px;
    }
  }
}
</style>
