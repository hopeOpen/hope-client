<template>
  <div class="role-wrapper">
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane v-for="tab in tabs" :key="tab.key" :name="tab.key" :label="tab.label">
        <component :is="tab.component"></component>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import PageControl from './pageControl/index.vue';
import roleConfig from './roleConfig/index.vue';
const activeName = ref('role');
const tabs = [
  {
    label: '角色权限',
    key: 'role',
    component: roleConfig
  },
  {
    label: '页面配置',
    key: 'page',
    component: PageControl
  }
];
</script>
<style lang="scss">
.role-wrapper {
  background: white;
  padding: 10px 20px 20px;
  box-sizing: border-box;
  height: 100%;
  .el-tabs {
    display: flex;
    flex-direction: column;
    height: 100%;
    .el-tabs__content {
      height: 100%;
      .el-tab-pane {
        height: 100%;
      }
    }
  }
}
</style>
