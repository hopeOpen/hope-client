<template>
  <div class="question-wrapper">
    <!-- 分类选项 -->
    <type-selection ref="typeSelectRef" v-model:typeParams="typesParams" />
    <!-- 题干 -->
    <topic v-model:html.sync="data.topic" />
    <!-- 选择题 -->
    <topic-option
      v-if="isChoice"
      ref="singleOptionRef"
      :topicType="typesParams.topicType"
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
  parsing: ''
};

const typesParams = ref({
  // 试题分类
  categoryId: '',
  // 题目类型
  topicType: TOPIC_TYPE.SINGLE_CHOICE,
  // 题目难度
  level: LEVEL_TYPES.EASY
});

const data = ref(JSON.parse(JSON.stringify(defaultData)));

// 是否选择题
const isChoice = computed(() => {
  const { SINGLE_CHOICE, MULTIPLE_CHOICE } = TOPIC_TYPE;
  return [SINGLE_CHOICE, MULTIPLE_CHOICE].includes(typesParams.value.topicType);
});
// 是否填空题
const isBlank = computed(() => {
  const { FILL_IN_THE_BLANKS } = TOPIC_TYPE;
  return typesParams.value.topicType === FILL_IN_THE_BLANKS;
});

// 重置
const singleOptionRef = ref();
const reset = () => {
  Object.assign(data.value, {
    topic: '',
    correctOption: '',
    options: [],
    parsing: ''
  });
  Object.assign(typesParams.value, {
    categoryId: '',
    topicType: 0,
    level: 0
  });
  data.value = JSON.parse(JSON.stringify(defaultData));
};
// 提交
const submit = () => {
  let verify = false;
  // 选择题
  if (isChoice.value) {
    verify = singleOptionRef.value.checkParams();
  }
  // 填空题
  if (typesParams.value.topicType === TOPIC_TYPE.FILL_IN_THE_BLANKS) {
    verify = data.value.correctOption !== '';
  }
  if (verify && data.value.topic.trim()) {
    const params = Object.assign({}, typesParams.value, data.value);
    // 不是选择题情况下清空选项
    if (isChoice.value) {
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
    const typesParamsKeys = Object.keys(typesParams.value);
    const dataKeys = Object.keys(data.value);
    const typesParamsMap: any = {};
    const dataMap: any = {};
    for (const key of typesParamsKeys) {
      typesParamsMap[key] = result[key];
    }
    for (const key of dataKeys) {
      dataMap[key] = result[key];
    }
    Object.assign(typesParams.value, typesParamsMap);
    Object.assign(data.value, dataMap);
    console.log('data.value', data.value);
  } catch (error) {
    console.log(error);
  }
}
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
