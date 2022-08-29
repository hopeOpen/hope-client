<template>
  <div class="options-wrapper">
    <span class="component-label">选项</span>
    <div class="answers-wrapper">
      <div
        class="item"
        v-for="(item, index) in optionsValue"
        :key="item.label"
        @mouseenter="onMouseenter(index)"
        @mouseleave="onMouseleave()"
      >
        <el-radio :label="getOptionsLabel(index)" v-model="correctOptionValue"></el-radio>
        <h-editor class="h-editor" :currentIndex="index" :placeholder="placeholder" v-model:html="item.answer" />
        <p class="operation" :class="actionIndex === index && 'is-show'">
          <el-icon @click="handleDelete(index)"><Delete /></el-icon>
          <el-icon :class="index === 0 && 'disabled'" @click="handleMoveUp(index)"><Top /></el-icon>
          <el-icon :class="index === optionsValue.length - 1 && 'disabled'" @click="handleMoveDown(index)">
            <Bottom />
          </el-icon>
        </p>
      </div>
      <span class="add-option" @click="addOptions">添加选项</span>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: 'SingleOption'
};
</script>
<script setup lang="ts">
import { ref, defineEmits, defineExpose, defineProps, computed } from 'vue';
import { ElMessage } from 'element-plus';
import HEditor from '@/views/components/editor/index.vue';
interface OptionsType {
  label: string;
  answer: string;
}
type PropsType = {
  options: OptionsType[];
  correctOption: string;
};
const props = defineProps<PropsType>();

const emit = defineEmits(['update:options', 'update:correctOption']);

// 选项
const optionsValue = computed({
  get() {
    return props.options;
  },
  set(val: any) {
    emit('update:options', val);
  }
});
// 正确答案
const correctOptionValue = computed({
  get() {
    return props.correctOption;
  },
  set(val: any) {
    emit('update:correctOption', val);
  }
});

const placeholder = '选项，点此编辑；选中即设置为正确答案 (必填)';

// 新增选项
const addOptions = () => {
  // ASCII 65 -> A
  const currentIndex = optionsValue.value.length + 65;
  const optionLabel = String.fromCharCode(currentIndex).toLocaleUpperCase();
  optionsValue.value.push({
    label: optionLabel,
    answer: ''
  });
};
// 获取选项label
const getOptionsLabel = (index: number) => {
  const currentIndex = index + 65;
  const optionLabel = String.fromCharCode(currentIndex).toLocaleUpperCase();
  optionsValue.value[index].label = optionLabel;
  return optionLabel;
};

// 操作图标
const actionIndex = ref();
const onMouseenter = (index: number) => {
  actionIndex.value = index;
};
const onMouseleave = () => {
  actionIndex.value = '';
};

// 校验参数
const checkParams = () => {
  const notInputs = optionsValue.value.filter((item: any) => !item.answer);
  if (notInputs.length) {
    ElMessage({
      type: 'error',
      message: '请输入完整'
    });
    return false;
  }
  if (!correctOptionValue.value) {
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

const handleDelete = (index: number) => {
  if (optionsValue.value.length > 1) {
    const label = optionsValue.value[index].label;
    if (label === correctOptionValue.value) {
      correctOptionValue.value = '';
    }
    // 删除选项的前几个, 正确选项需要后退
    if (label < correctOptionValue.value && correctOptionValue.value) {
      correctOptionValue.value = String.fromCharCode(correctOptionValue.value.charCodeAt() - 1);
    }
    optionsValue.value.splice(index, 1);
  } else {
    ElMessage({
      type: 'warning',
      message: '至少保留一个选项'
    });
  }
};

const handleMoveUp = (index: number) => {
  if (index === 0) return;
  [optionsValue.value[index - 1], optionsValue.value[index]] = [
    optionsValue.value[index],
    optionsValue.value[index - 1]
  ];
};
const handleMoveDown = (index: number) => {
  if (index === optionsValue.value.length - 1) return;
  [optionsValue.value[index], optionsValue.value[index + 1]] = [
    optionsValue.value[index + 1],
    optionsValue.value[index]
  ];
};
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
      .operation {
        visibility: hidden;
        .el-icon {
          margin-left: 10px;
          font-size: 14px;
          color: #656577;
          cursor: pointer;
          &:hover {
            color: #1a8cfe;
          }
        }
        .disabled {
          cursor: not-allowed;
        }
        &.is-show {
          visibility: visible;
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
