<template>
  <main class="topic-details__wrap">
    <div class="con-left">
      <!-- 题目 -->
      <div class="item">
        <span class="component-label">题干</span>
        <span class="content we-content" v-html="topic"></span>
      </div>
      <!-- 选项 -->
      <div class="item options-wrap" v-if="isChoice">
        <span class="component-label">选项</span>
        <p class="option content" v-for="op in options" :key="op.label">
          <span>{{ op.label }} :</span>
          <span class="option-content" v-html="op.answer"></span>
        </p>
      </div>
    </div>
    <div class="con-right">
      <p class="item">
        <span class="component-label">答案</span>
        <span class="content" v-html="correctOption"></span>
      </p>
      <p class="item">
        <span class="component-label">解析</span>
        <span class="content we-content" v-html="parsing"></span>
      </p>
    </div>
  </main>
</template>
<script lang="ts">
export default {
  name: 'TopicDetails'
};
</script>
<script setup lang="ts">
import { defineProps, computed } from 'vue';
import { QuestionType } from '@/types/index';
import { TOPIC_TYPE } from '@/constants';
const props = defineProps<{
  data: QuestionType;
}>();
const topic = computed(() => {
  let content = props.data.topic;
  content = content.replace(/<p><br><\/p>$/g, '');
  return content;
});
const options = computed(() => {
  return JSON.parse(props.data.options as string);
});
const parsing = computed(() => {
  return props.data.parsing;
});
const correctOption = computed(() => {
  const { correctOption, topicType } = props.data;
  // 多选的情况
  if (topicType === TOPIC_TYPE.MULTIPLE_CHOICE) {
    const answers = correctOption.split('');
    return answers.reduce((str, item, index) => {
      return `${str}${item}${index !== answers.length - 1 ? '、' : ''}`;
    }, '');
  }
  return correctOption;
});
// 是否选择题
const isChoice = computed(() => {
  const { SINGLE_CHOICE, MULTIPLE_CHOICE } = TOPIC_TYPE;
  return [SINGLE_CHOICE, MULTIPLE_CHOICE].includes(props.data.topicType);
});
</script>
<style lang="scss">
.topic-details__wrap {
  padding: 0 35px;
  box-sizing: border-box;
  display: flex;
  .con-left,
  .con-right {
    flex: 1;
  }
  .con-left + .con-right {
    margin-left: 20px;
  }
  .item {
    display: flex;
    flex-direction: column;
    .component-label {
      top: 0;
      margin-bottom: 10px;
    }
    &.options-wrap {
      margin-top: 10px;
    }
    .option {
      display: flex;
      margin: 4px 0px;
      &-content {
        margin-left: 10px;
      }
    }
    .content {
      margin-left: 48px;
    }
  }
}
</style>
