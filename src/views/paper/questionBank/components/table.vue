<template>
  <el-table v-bind="props.tableConfig" :data="props.tableData" style="width: 100%">
    <template v-for="item in props.colConfig">
      <slot v-if="item.slot" :name="item.slot" />
      <el-table-column v-else v-bind="item" :key="item.prop"></el-table-column>
    </template>
  </el-table>
</template>
<script setup lang="ts">
import { defineProps } from 'vue';
type PropsType = {
  tableData: any[];
  colConfig: any[];
  tableConfig: any;
};
const props = defineProps<PropsType>();
</script>
<style lang="scss">
.page-wrapper {
  font-size: 50px;
}
</style>
