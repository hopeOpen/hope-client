<template>
  <div class="type-wrapper">
    <p class="item">
      <span class="label">
        试题分类
        <i class="require">*</i>
      </span>
      <category-select v-model:categoryId="typeParamsValue.categoryId" />
    </p>
    <p class="item">
      <span class="label">
        题目类型
        <i class="require">*</i>
      </span>
      <el-select
        size="small"
        class="topic-select"
        v-model="typeParamsValue.topicType"
        placeholder="选择分类"
        @change="handleChange"
      >
        <el-option v-for="item in topicTypes" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
    </p>
    <p class="item">
      <span class="label">
        题目难度
        <i class="require">*</i>
      </span>
      <el-select size="small" class="topic-select" v-model="typeParamsValue.level" placeholder="题目难度">
        <el-option v-for="item in topicLevels" :key="item.level" :label="item.label" :value="item.level" />
      </el-select>
    </p>
  </div>
</template>
<script setup lang="ts">
import { computed, defineEmits, defineProps } from 'vue';
import { topicTypes, topicLevels } from '@/constants';
import CategorySelect from '@/views/components/categorySelect/index.vue';
const emit = defineEmits(['update:typeParams', 'topicTypeChange']);

const props = defineProps({
  typeParams: {
    type: Object,
    required: true
  }
});

const typeParamsValue = computed({
  get() {
    return props.typeParams;
  },
  set(val) {
    console.log(val);
    emit('update:typeParams', val);
    return true;
  }
});

const handleChange = () => {
  emit('topicTypeChange');
};
</script>
<style lang="scss">
.type-wrapper {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
  .item {
    display: flex;
    align-items: center;
    margin-right: 20px;
    .label {
      margin-right: 5px;
    }
    .topic-select {
      width: 100px;
    }
  }
  .require {
    color: red;
  }
}
</style>
