<template>
  <main class="topic-details__wrap">
    <!-- 题目 -->
    <p>
      <span>{{ props.data.topic }}</span>
    </p>
  </main>
</template>
<script lang="ts">
export default {
  name: 'TopicDetails'
};
</script>
<script setup lang="ts">
import { defineProps } from 'vue';
import { QuestionType } from '@/types/index';
const props = defineProps<{
  data: QuestionType;
}>();
</script>
<style lang="scss">
.topic-details__wrap {
}
</style>
