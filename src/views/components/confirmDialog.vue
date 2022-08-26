<template>
  <el-dialog v-model="visible" :title="props.title" width="480px" class="confirm-dialog-wrapper">
    <template #footer>
      <el-button type="primary" @click="handleConfirm">
        {{ buttnName }}
      </el-button>
      <el-button @click="handleCancel">取消</el-button>
    </template>
    <slot />
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, defineProps, defineExpose } from 'vue';
const visible = ref(false);
const resolve = ref();
const reject = ref();
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  buttnName: {
    type: String,
    default: '确定'
  }
});

const handleConfirm = () => {
  console.log('handleConfirm');
  if (resolve.value) {
    resolve.value();
  }
  visible.value = false;
};
const handleCancel = () => {
  console.log('handleCancel');
  if (reject.value) {
    reject.value();
  }
  visible.value = false;
};
const message = () => {
  visible.value = true;
  const p = new Promise((resolve_, reject_) => {
    resolve.value = resolve_;
    reject.value = reject_;
  });
  return p;
};
defineExpose({
  message
});
</script>
<style lang="scss">
.confirm-dialog-wrapper {
  .el-dialog__title {
    font-size: 14px;
  }
  .el-dialog__body {
    padding: 20px 32px;
    .title {
      display: flex;
      align-items: center;
    }
    .text {
      margin-left: 8px;
      font-size: 16px;
      line-height: 24px;
      color: #333;
    }
    .description {
      display: inline-block;
      margin-top: 8px;
      margin-left: 28px;
      font-size: 12px;
      line-height: 18px;
      color: #999;
    }
    .el-icon-warning {
      font-size: 20px;
      color: #ff950a;
    }
  }
  .el-dialog__footer {
    padding: 24px;
    padding-top: 18px;
  }
}
</style>
