<template>
  <div class="qu-wrapper">
    <category :category="categoryData" @fetch="fetchCategory" />
    <main class="qu-main e-container">
      <header>.....</header>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="id" width="180" />
        <el-table-column prop="name" label="Name" width="180" />
        <el-table-column prop="address" label="Address" />
      </el-table>
    </main>
  </div>
</template>
<script setup lang="ts">
import Category from '@/views/components/category/index.vue';
import { categoryList } from '@/apis/category';
import { reactive } from 'vue';
import { CategoryType } from '@/types/index';
const tableData: any = [];

// 获取分类列表
const categoryData: CategoryType[] = reactive([]);

const fetchCategory = () => {
  categoryList().then((res) => {
    categoryData.length = 0;
    categoryData.push(...res);
  });
};
fetchCategory();
</script>
<style lang="scss">
.qu-wrapper {
  display: flex;
  .qu-main {
    margin-left: 20px;
  }
}
</style>
