<template>
  <div class="page-wrapper">
    <h1>页面</h1>
  </div>
</template>
<script setup lang="ts">
import { useStore } from 'vuex';

console.log(useStore());
</script>
<style lang="scss">
.page-wrapper {
  font-size: 50px;
}
</style>
