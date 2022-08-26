<template>
  <div class="que-wrapper">
    <el-tabs v-model="activeTab" class="demo-tabs" @tab-click="changeActiveTab">
      <el-tab-pane :label="tab.label" :name="tab.key" v-for="tab in tabLIst" :key="tab.id">
        <component :is="tab.component" v-if="activeTab === tab.key" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter, useRoute, LocationQueryValue } from 'vue-router';
import addQuestion from './add/index.vue';
const activeTab = ref<string | LocationQueryValue[]>('');
const router = useRouter();
const route = useRoute();
const tabLIst = [
  {
    label: '新增题目',
    key: 'addQuestion',
    id: 1,
    component: addQuestion
  },
  {
    label: '新增题目1',
    key: 'addQuestion1',
    id: 2,
    component: addQuestion
  }
];
console.log(route.query.query);
activeTab.value = route.query.type || 'addQuestion';
const changeActiveTab = () => {
  if (activeTab.value === 'addQuestion') {
    router.push({ path: '/paper/testQuestion?type=addQuestion' });
  } else if (activeTab.value === 'addQuestion1') {
    router.push({ path: '/paper/testQuestion?type=addQuestion1' });
  }
};
</script>
<style lang="scss">
.que-wrapper {
  padding: 20px;
  box-sizing: border-box;
  background-color: white;
}
</style>
