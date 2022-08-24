<template>
  <div class="qu-wrapper">
    <category />
    <main class="qu-main e-container">
      <header>.....</header>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="date" label="Date" width="180" />
        <el-table-column prop="name" label="Name" width="180" />
        <el-table-column prop="address" label="Address" />
      </el-table>
    </main>
  </div>
</template>
<script setup lang="ts">
import Category from '@/views/components/category/index.vue';
const tableData: any = [];
</script>
<style lang="scss">
.qu-wrapper {
  display: flex;
  .qu-main {
    margin-left: 20px;
  }
}
</style>
