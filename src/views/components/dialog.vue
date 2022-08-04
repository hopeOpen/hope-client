<template>
  <el-dialog v-model="dialogVisible" :title="title" :width="width" :before-close="handleClose">
    <slot />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">{{ cancelText }}</el-button>
        <el-button type="primary" @click="confirm">{{ confirmText }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from 'vue';

export default defineComponent({
  name: 'HopeDialog',
  props: {
    width: {
      type: String,
      default: '500px'
    },
    title: {
      type: String,
      default: '添加'
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    confirmText: {
      type: String,
      default: '确定'
    }
  },
  setup(props, { expose, emit }) {
    const dialogVisible = ref<boolean>(false);
    const handleClose = () => {
      console.log('');
    };
    const open = () => {
      dialogVisible.value = true;
    };
    const close = () => {
      dialogVisible.value = false;
    };
    const confirm = () => {
      emit('confirm');
    };
    const cancel = () => {
      emit('cancel');
    };
    // 向外暴露函数
    expose({
      open,
      close
    });
    return {
      ...toRefs(props),
      handleClose,
      dialogVisible,
      confirm,
      cancel
    };
  }
});
</script>

<style></style>
