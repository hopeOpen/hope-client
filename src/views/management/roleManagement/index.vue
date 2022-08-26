<template>
  <div class="role-wrapper">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane v-for="tab in tabs" :key="tab.key" :name="tab.key" :label="tab.label">
        <component :is="tab.component"></component>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import PageControl from './pageControl/index.vue';
const activeName = ref('page');
const tabs = [
  {
    label: '角色权限',
    key: 'role',
    component: ''
  },
  {
    label: '页面控制',
    key: 'page',
    component: PageControl
  }
];
</script>
<style lang="scss" scoped>
.role-wrapper {
  background: white;
  padding: 10px 20px 20px;
  box-sizing: border-box;
}
</style>
