<template>
  <div class="menus-wrapper">
    <div class="e-container">
      <div v-for="item in pageList" :key="item.sign">s</div>
      <section class="page-config__block"></section>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive } from 'vue';
import { getMenusConfig } from '@/apis/menu';
const pageList = reactive<any>([]);

const fetchData = async () => {
  try {
    const result = await getMenusConfig();
    pageList.push(...result);
  } catch (error) {
    console.log(error);
  }
};
fetchData();
</script>

<style lang="scss">
.menus-wrapper {
  .e-container {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }
}
</style>
