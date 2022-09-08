<template>
  <div class="question-wrapper">
    <!-- 分类选项 -->
    <type-selection ref="typeSelectRef" v-model:typeParams="data" @topicTypeChange="handleTopicTypeChange" />
    <!-- 题干 -->
    <topic v-model:html.sync="data.topic" />
    <!-- 选择题 -->
    <topic-option
      v-if="isChoice"
      ref="optionRef"
      :topicType="data.topicType"
      v-model:options="data.options"
      v-model:correctOption="data.correctOption"
    />
    <!-- 填空题 -->
    <question-answer v-if="isBlank" v-model:html="data.correctOption" />
    <!-- 解析 -->
    <parsing v-model:html="data.parsing" />
    <p class="btns">
      <el-button @click="reset" v-if="!isEdit">重置</el-button>
      <el-button type="primary" @click="submit">{{ isEdit ? '保存' : '提交' }}</el-button>
    </p>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed, defineProps } from 'vue';
import { useRoute } from 'vue-router';
import Topic from '@/views/paper/testQuestion/components/topicDes.vue';
import Parsing from '@/views/paper/testQuestion/components/parsing.vue';
import TopicOption from '@/views/paper/testQuestion/components/topicOption.vue';
import TypeSelection from '@/views/paper/testQuestion/components/typeSelection.vue';
import QuestionAnswer from '@/views/paper/testQuestion/components/questionAnswer.vue';
import { TOPIC_TYPE, LEVEL_TYPES, OPERATING_TYPE } from '@/constants';
import { ElMessage } from 'element-plus';
import { addQuestion, questionDetail, updateQuestion } from '@/apis/testQuestion';
import { QuestionType } from '@/types';
const route = useRoute();
const props = defineProps<{
  operatingType: string;
}>();
// 是否编辑模式
const isEdit = computed(() => {
  return props.operatingType === OPERATING_TYPE.EDIT;
});
const defaultData = {
  // 题目
  topic: '',
  // 正确答案
  correctOption: '',
  // 选项
  options: [
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
  ],
  // 解析
  parsing: '',
  // 试题分类
  categoryId: '',
  // 题目类型
  topicType: TOPIC_TYPE.SINGLE_CHOICE,
  // 题目难度
  level: LEVEL_TYPES.EASY
};

const data = ref<QuestionType>(JSON.parse(JSON.stringify(defaultData)));

// 是否选择题
const isChoice = computed(() => {
  const { SINGLE_CHOICE, MULTIPLE_CHOICE } = TOPIC_TYPE;
  return [SINGLE_CHOICE, MULTIPLE_CHOICE].includes(data.value.topicType);
});
// 是否填空题
const isBlank = computed(() => {
  const { FILL_IN_THE_BLANKS } = TOPIC_TYPE;
  return data.value.topicType === FILL_IN_THE_BLANKS;
});

// 重置
const optionRef = ref();
const reset = () => {
  Object.assign(data.value, JSON.parse(JSON.stringify(defaultData)));
};
// 提交
const submit = () => {
  let verify = false;
  // 选择题
  if (isChoice.value) {
    verify = optionRef.value.checkParams();
  }
  // 填空题
  if (data.value.topicType === TOPIC_TYPE.FILL_IN_THE_BLANKS) {
    verify = data.value.correctOption !== '';
  }
  if (verify && data.value.topic.trim()) {
    const params = Object.assign({}, data.value, data.value);
    // 不是选择题情况下清空选项
    if (isBlank.value) {
      params.options = [];
    }
    if (isEdit.value) {
      edit(params);
    } else {
      add(params);
    }
  }
};
// 新增
const add = async (params: QuestionType) => {
  try {
    await addQuestion(params);
    // 重置题目
    reset();
    ElMessage({
      type: 'success',
      message: '新增成功'
    });
  } catch (error) {
    console.log(error);
  }
};
// 更新
const edit = async (params: QuestionType) => {
  try {
    params.id = route.query.questionId as string;
    await updateQuestion(params);
    ElMessage({
      type: 'success',
      message: '更新成功'
    });
    setTimeout(() => {
      window.close();
    }, 500);
  } catch (error) {
    console.log(error);
  }
};

// 获取题目详情
const id: string | undefined = route.query.questionId as string | undefined;
if (id) {
  getQuestionDetail({ id });
}
async function getQuestionDetail(params: { id: string }) {
  try {
    const result = await questionDetail(params);
    Object.assign(data.value, result);
    optionRef.value.initMuCorrectOptionValue(result.options.length);
    optionRef.value.initAnswer(result.correctOption);
  } catch (error) {
    console.log(error);
  }
}

// 题目类型改变时
const handleTopicTypeChange = () => {
  data.value.correctOption = '';
  const { topicType } = data.value;
  const { MULTIPLE_CHOICE, SINGLE_CHOICE } = TOPIC_TYPE;
  // 选择题 要把options填充
  if ([MULTIPLE_CHOICE, SINGLE_CHOICE].includes(topicType) && !data.value.options.length) {
    data.value.options = [...defaultData.options];
  }
  if (topicType === TOPIC_TYPE.MULTIPLE_CHOICE) {
    optionRef.value && optionRef.value.initMuCorrectOptionValue();
  }
};
</script>

<style lang="scss">
.question-wrapper {
  padding: 0px 20px 20px 20px;
  box-sizing: border-box;
  background-color: white;
  .btns {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
