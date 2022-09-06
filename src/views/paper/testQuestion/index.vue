<template>
  <div class="que-wrapper">
    <el-tabs v-model="activeTab" class="demo-tabs" @tab-click="changeActiveTab">
      <el-tab-pane :label="tab.label" :name="tab.key" v-for="tab in tabList" :key="tab.id">
        <component :is="tab.component" :operatingType="operatingType" v-if="activeTab === tab.key" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRouter, useRoute, LocationQueryValue } from 'vue-router';
import addQuestion from './add/index.vue';
import { OPERATING_TYPE } from '@/constants';

const activeTab = ref<string | LocationQueryValue[]>('');
const router = useRouter();
const route = useRoute();
const tabList = ref([
  {
    label: '新增题目',
    key: 'addQuestion',
    id: 1,
    component: addQuestion
  }
]);
activeTab.value = route.query.type || 'addQuestion';

const changeActiveTab = () => {
  if (activeTab.value === 'addQuestion') {
    router.push({ path: '/paper/testQuestion?type=addQuestion' });
  } else if (activeTab.value === 'addQuestion1') {
    router.push({ path: '/paper/testQuestion?type=addQuestion1' });
  }
};

// 操作类型
const operatingType = ref(OPERATING_TYPE.ADD);
watch(
  () => route.query.questionId,
  (val) => {
    if (val) {
      operatingType.value = OPERATING_TYPE.EDIT;
      tabList.value[0].label = '编辑题目';
    }
  },
  {
    deep: true,
    immediate: true
  }
);
</script>
<style lang="scss">
.que-wrapper {
  padding: 20px;
  box-sizing: border-box;
  background-color: white;
}
</style>
