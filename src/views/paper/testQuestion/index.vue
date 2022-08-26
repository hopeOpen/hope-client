<template>
  <div class="question-wrapper">
    <!-- 题干 -->
    <topic v-model:html="data.topic" />
    <!-- 选项/答案 -->
    <options-com ref="optionsComRef" @change="onChange" />
    <!-- 解析 -->
    <parsing v-model:html="data.parsing" />
    <p class="btns">
      <el-button @click="reset">重置</el-button>
      <el-button type="primary" @click="submit">提交</el-button>
    </p>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue';
import Topic from '@/views/paper/testQuestion/components/topicDes.vue';
import Parsing from '@/views/paper/testQuestion/components/parsing.vue';
import OptionsCom from '@/views/paper/testQuestion/components/optionsCom.vue';
import { addQuestion } from '@/apis/testQuestion';

const data = reactive({
  // 题目类型 0当选
  type: 0,
  // 题目
  topic: '',
  // 正确答案
  correctOption: '',
  // 选项
  options: [],
  // 解析
  parsing: ''
});
const onChange = (value: any, radio: string) => {
  data.options = value;
  data.correctOption = radio;
};
// 重置
const reset = () => {
  Object.assign(data, {
    // 题目
    topic: '',
    // 正确答案
    correctOption: '',
    // 选项
    options: [],
    // 解析
    parsing: ''
  });
};
// 提交
const optionsComRef = ref();
console.log(optionsComRef);
const submit = () => {
  console.log(optionsComRef);
  const verify = optionsComRef.value.checkParams();
  if (verify && data.topic.trim()) {
    addQuestion(data)
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  }
};
</script>
<style lang="scss">
.question-wrapper {
  padding: 20px;
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
