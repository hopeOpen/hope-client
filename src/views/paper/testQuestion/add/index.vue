<template>
  <div class="question-wrapper">
    <!-- 分类选项 -->
    <type-selection ref="typeSelectRef" v-model:typeParams="typesParams" />
    <!-- 题干 -->
    <topic v-model:html.sync="data.topic" />
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
import { reactive, ref, watch } from 'vue';
import Topic from '@/views/paper/testQuestion/components/topicDes.vue';
import Parsing from '@/views/paper/testQuestion/components/parsing.vue';
import OptionsCom from '@/views/paper/testQuestion/components/optionsCom.vue';
import TypeSelection from '@/views/paper/testQuestion/components/typeSelection.vue';
import { addQuestion } from '@/apis/testQuestion';
import { ElMessage } from 'element-plus';

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

const data = reactive({
  // 题目
  topic: 'js good',
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
    topic: '',
    correctOption: '',
    options: [],
    parsing: ''
  });
  Object.assign(typesParams.value, {
    // 试题分类
    categoryType: '',
    // 题目类型
    topicType: 0,
    level: 0
  });
};
// 提交
const optionsComRef = ref();
const submit = async () => {
  const verify = optionsComRef.value.checkParams();
  if (verify && data.topic.trim()) {
    const params = Object.assign({}, typesParams.value, data);
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
