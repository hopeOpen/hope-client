<template>
  <div class="options-wrapper">
    <span class="component-label">选项</span>
    <div class="answers-wrapper">
      <div
        class="item"
        v-for="(item, index) in answerData"
        :key="item.label"
        @mouseenter="onMouseenter(index)"
        @mouseleave="onMouseleave(index)"
      >
        <el-radio :label="getOptionsLabel(index)" v-model="radio"></el-radio>
        <h-editor class="h-editor" :currentIndex="index" :placeholder="placeholder" v-model:html="item.answer" />
        <p class="icon-wrap" v-show="actionIndex === index">
          <el-icon><Delete /></el-icon>
          <el-icon><Top /></el-icon>
          <el-icon><Bottom /></el-icon>
        </p>
      </div>
      <span class="add-option" @click="addOptions">添加选项</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, watch, defineEmits, defineExpose } from 'vue';
import { ElMessage } from 'element-plus';
import HEditor from '@/views/components/editor/index.vue';
const emit = defineEmits(['change']);
const placeholder = '选项，点此编辑；选中即设置为正确答案 (必填)';
// 正确选项
const radio = ref('');
const answerData = reactive([
  {
    label: 'A',
    answer: ''
  },
  {
    label: 'B',
    answer: ''
  },
  {
    label: 'C',
    answer: ''
  },
  {
    label: 'D',
    answer: ''
  }
]);

watch(radio, () => {
  emit('change', answerData, radio);
});
watch(
  answerData,
  (value) => {
    emit('change', value, radio);
  },
  {
    deep: true,
    immediate: true
  }
);

// 新增选项
const addOptions = () => {
  // ASCII 65 -> A
  const currentIndex = answerData.length + 65;
  const optionLabel = String.fromCharCode(currentIndex).toLocaleUpperCase();
  answerData.push({
    label: optionLabel,
    answer: ''
  });
};
// 获取选项label
const getOptionsLabel = (index: number) => {
  const currentIndex = index + 65;
  const optionLabel = String.fromCharCode(currentIndex).toLocaleUpperCase();
  return optionLabel;
};

// 操作图标
const actionIndex = ref();
const onMouseenter = (index: number) => {
  actionIndex.value = index;
};
const onMouseleave = (index: number) => {
  actionIndex.value = index;
};

// 校验参数
const checkParams = () => {
  const notInputs = answerData.filter((item) => !item.answer);
  console.log('notInputs-->', notInputs);
  if (notInputs.length) {
    ElMessage({
      type: 'error',
      message: '请输入完整'
    });
    return false;
  }
  if (!radio.value) {
    ElMessage({
      type: 'error',
      message: '请选择正确选项'
    });
    return false;
  }
  return true;
};

defineExpose({
  checkParams
});
</script>

<style lang="scss">
.options-wrapper {
  display: flex;
  margin-top: 12px;
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
    top: 22px;
  }
  .answers-wrapper {
    flex: 1;
    border-top: 1px dashed #dcdfe6;
    border-bottom: 1px dashed #dcdfe6;
    padding: 12px 0;
    margin-bottom: 12px;
    .el-radio {
      margin: 2px 14px 0 0;
    }
    .item {
      width: 100%;
      display: flex;
      .icon-wrap {
        .el-icon {
          margin-left: 10px;
          font-size: 14px;
          color: #656577;
          cursor: pointer;
          &:hover {
            color: #1a8cfe;
          }
        }
      }
    }
    .item + .item {
      margin-top: 6px;
    }
    .add-option {
      display: block;
      cursor: pointer;
      margin: 12px 0 0;
    }
  }
}
</style>
