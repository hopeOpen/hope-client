<template>
  <main class="topic-details__wrap">
    <div class="con-left">
      <!-- 题目 -->
      <div class="item">
        <span class="component-label">题干</span>
        <span class="we-content" v-html="topic"></span>
      </div>
      <!-- 选项 -->
      <div class="item options-wrap">
        <span class="component-label">选项</span>
        <p class="option" v-for="op in options" :key="op.label">
          <span>{{ op.label }}</span>
          :
          <span class="option-content" v-html="op.answer"></span>
        </p>
      </div>
    </div>
    <div class="con-right">
      <p class="item">
        <span class="component-label">解析</span>
        <span v-html="parsing"></span>
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
const props = defineProps<{
  data: QuestionType;
}>();
const topic = computed(() => {
  const content = props.data.topic;
  content.replace(/<p><br><\/p>$/, '');
  return content;
});
const options = computed(() => {
  return JSON.parse(props.data.options as string);
});
const parsing = computed(() => {
  return props.data.parsing;
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
      margin: 4px 0px;
      &-content {
        margin-left: 10px;
      }
    }
  }
}
</style>
