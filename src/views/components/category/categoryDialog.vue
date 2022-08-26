<template>
  <el-dialog
    :title="props.title"
    :width="props.width"
    :visible="props.visible"
    @close="handleClose"
    custom-class="category-dialog-wrapper reset-el-dialog"
  >
    <!-- 底部按钮 -->
    <template #footer>
      <span>
        <el-button :loading="loading" :disabled="disabled" type="primary" @click="handleConfirm">保存</el-button>
        <el-button
          v-show="props.showContinueButton"
          :loading="props.loading"
          :disabled="disabled"
          @click="handleContinue"
        >
          保存并新建下一个
        </el-button>
        <el-button @click="handleCancel">取消</el-button>
      </span>
    </template>
    <!-- 内容区域 -->
    <main class="dialog-main">
      <span class="label">{{ label }}</span>
      <el-input
        ref="contentArea"
        v-model="content"
        show-word-limit
        maxlength="20"
        class="input"
        placeholder="请输入分类名称"
      />
    </main>
  </el-dialog>
</template>
<script setup lang="ts">
import { defineProps, defineEmits, ref, computed } from 'vue';
const emit = defineEmits(['confirm', 'cancel', 'continue', 'visibleChange']);
const props = defineProps({
  title: {
    type: String,
    default: '新建一级分类'
  },
  label: {
    type: String,
    default: '分类名称'
  },
  width: {
    type: String,
    default: '480px'
  },
  visible: {
    type: Boolean,
    default: false
  },
  showContinueButton: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
});
const content = ref('');
const init = () => {
  content.value = '';
};
const handleConfirm = () => {
  emit('confirm', content.value.trim());
};
const handleCancel = () => {
  emit('cancel');
};
const handleContinue = () => {
  emit('continue', content.value.trim());
};
const handleClose = () => {
  emit('visibleChange', false);
  init();
};
const disabled = computed(() => {
  return content.value.trim().length <= 0;
});
</script>
<style lang="scss">
.category-dialog-wrapper {
  .dialog-main {
    margin-bottom: 20px;
    .input {
      margin-top: 8px;
    }
  }
}
</style>
