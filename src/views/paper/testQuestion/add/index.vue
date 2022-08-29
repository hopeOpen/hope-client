<template>
  <div class="question-wrapper">
    <!-- 分类选项 -->
    <type-selection ref="typeSelectRef" v-model:typeParams="typesParams" />
    <!-- 题干 -->
    <topic v-model:html.sync="data.topic" />
    <!-- 单选 -->
    <single-option ref="singleOptionRef" v-model:options="data.options" v-model:correctOption="data.correctOption" />
    <!-- 解析 -->
    <parsing v-model:html="data.parsing" />
    <p class="btns">
      <el-button @click="reset">重置</el-button>
      <el-button type="primary" @click="submit">提交</el-button>
    </p>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue';
import Topic from '@/views/paper/testQuestion/components/topicDes.vue';
import Parsing from '@/views/paper/testQuestion/components/parsing.vue';
import SingleOption from '@/views/paper/testQuestion/components/singleOption.vue';
import TypeSelection from '@/views/paper/testQuestion/components/typeSelection.vue';
import { addQuestion } from '@/apis/testQuestion';
import { ElMessage } from 'element-plus';

const defaultData = {
  // 题目
  topic: 'js good',
  // 正确答案
  correctOption: 'A',
  // 选项
  options: [
    {
      label: 'A',
      answer: '1'
    },
    {
      label: 'B',
      answer: '2'
    },
    {
      label: 'C',
      answer: '3'
    },
    {
      label: 'D',
      answer: '4'
    }
  ],
  // 解析
  parsing: '解析'
};

const typesParams = ref({
  // 试题分类
  categoryType: 13,
  // 题目类型
  topicType: 1,
  // 题目难度
  level: 1
});

watch(
  typesParams,
  (val) => {
    console.log('ye===>', val);
  },
  {
    deep: true
  }
);

const data = ref(JSON.parse(JSON.stringify(defaultData)));

// const onChange = (value: any, radio: string) => {
//   data.options = value;
//   data.correctOption = radio;
// };
// 重置
const singleOptionRef = ref();
const reset = () => {
  Object.assign(data, {
    topic: '',
    correctOption: '',
    options: [],
    parsing: ''
  });
  Object.assign(typesParams.value, {
    categoryType: '',
    topicType: 0,
    level: 0
  });
  data.value = JSON.parse(JSON.stringify(defaultData));
};
// 提交
const submit = async () => {
  const verify = singleOptionRef.value.checkParams();
  if (verify && data.value.topic.trim()) {
    const params = Object.assign({}, typesParams.value, data.value);
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
