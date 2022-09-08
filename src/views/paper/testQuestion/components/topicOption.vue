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
        <!-- 单选框 -->
        <el-radio
          v-if="TOPIC_TYPE.SINGLE_CHOICE === props.topicType"
          :label="getOptionsLabel(index)"
          v-model="correctOptionValue"
        ></el-radio>
        <!-- 多选框 -->
        <el-checkbox
          v-if="TOPIC_TYPE.MULTIPLE_CHOICE === props.topicType"
          v-model="muCorrectOptionValue[index]"
          :label="getOptionsLabel(index)"
          size="large"
          @change="checkboxChange"
        />
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
  name: 'TopicOption'
};
</script>
<script setup lang="ts">
import { ref, defineEmits, defineExpose, defineProps, computed } from 'vue';
import { ElMessage } from 'element-plus';
import HEditor from '@/views/components/editor/index.vue';
import { TOPIC_TYPE } from '@/constants';
interface OptionsType {
  label: string;
  answer: string;
}
type PropsType = {
  options: OptionsType[];
  correctOption: string;
  topicType: string | number;
};
const emit = defineEmits(['update:options', 'update:correctOption']);
const props = defineProps<PropsType>();
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

// 多选答案
const muCorrectOptionValue = ref(new Array(optionsValue.value.length).fill(false));

// checkbox 改变时触发生成正确答案
const checkboxChange = () => {
  let value = '';
  muCorrectOptionValue.value.forEach((item, index) => {
    if (item) {
      value = `${value}${optionsValue.value[index].label}`;
    }
  });
  correctOptionValue.value = value;
};

// 初始化多答案
const initMuCorrectOptionValue = (length: number) => {
  muCorrectOptionValue.value.length = 0;
  muCorrectOptionValue.value.push(...new Array(length || optionsValue.value.length).fill(false));
};

// 初始化答案
const initAnswer = (answer: string) => {
  answer.split('').forEach((item) => {
    const index = `${item}`.charCodeAt(0) - 65;
    muCorrectOptionValue.value[index] = true;
  });
};

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
  // 多选
  if (props.topicType === TOPIC_TYPE.MULTIPLE_CHOICE) {
    muCorrectOptionValue.value.push(false);
  }
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
  checkParams,
  initAnswer,
  initMuCorrectOptionValue
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

    // 多选
    if (props.topicType === TOPIC_TYPE.MULTIPLE_CHOICE) {
      muCorrectOptionValue.value.splice(index, 1);
    }
  } else {
    ElMessage({
      type: 'warning',
      message: '至少保留一个选项'
    });
  }
};

//选项上移动
const handleMoveUp = (index: number) => {
  if (index === 0) return;
  [optionsValue.value[index - 1], optionsValue.value[index]] = [
    optionsValue.value[index],
    optionsValue.value[index - 1]
  ];

  // 多选
  if (props.topicType === TOPIC_TYPE.MULTIPLE_CHOICE) {
    [muCorrectOptionValue.value[index - 1], muCorrectOptionValue.value[index]] = [
      muCorrectOptionValue.value[index],
      muCorrectOptionValue.value[index - 1]
    ];
  }
};
//选项下移动
const handleMoveDown = (index: number) => {
  if (index === optionsValue.value.length - 1) return;
  [optionsValue.value[index], optionsValue.value[index + 1]] = [
    optionsValue.value[index + 1],
    optionsValue.value[index]
  ];

  // 多选
  if (props.topicType === TOPIC_TYPE.MULTIPLE_CHOICE) {
    [muCorrectOptionValue.value[index], muCorrectOptionValue.value[index + 1]] = [
      muCorrectOptionValue.value[index + 1],
      muCorrectOptionValue.value[index]
    ];
  }
};
</script>

<style lang="scss">
.options-wrapper {
  display: flex;
  margin-top: 12px;
  .answers-wrapper {
    flex: 1;
    border-top: 1px dashed #dcdfe6;
    border-bottom: 1px dashed #dcdfe6;
    padding: 12px 0;
    margin-bottom: 12px;
    .el-radio {
      margin: 2px 14px 0 0;
    }
    .el-checkbox {
      margin: -2px 14px 0 0;
    }
    .item {
      width: 100%;
      display: flex;
      .operation {
        visibility: hidden;
        display: flex;
        align-items: center;
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
