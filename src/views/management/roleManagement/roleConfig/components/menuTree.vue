<template>
  <el-tree
    class="menu-tree"
    node-key="id"
    show-checkbox
    default-expand-all
    :data="props.pageList"
    :props="props.treeProps"
    :default-checked-keys="checkedKeys"
    @check-change="handleCheckChange"
  >
    <template #default="{ node, data }">
      <span class="custom-tree-node">
        <span>{{ node.label }} == {{ data.id }}</span>
      </span>
    </template>
  </el-tree>
</template>
<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';
import { MenuType } from '@/types/index';
const props = defineProps({
  pageList: Array,
  treeProps: Object,
  checkedKeys: Array
});
const emit = defineEmits(['check-change']);
const checkedKeys = computed(() => {
  return props.checkedKeys;
});
/**
 * 当复选框被点击的时候触发
 * @params data 传递给 data 属性的数组中该节点所对应的对象
 * @params checked 节点本身是否被选中
 * @params 节点的子树中是否有被选中的节点
 */
const handleCheckChange = (data: MenuType, checked: boolean, indeterminate: boolean) => {
  emit('check-change', data, checked, indeterminate);
};
</script>
<style lang="scss">
.menu-tree {
  flex: 1;
  .el-tree-node__content {
    height: 38px;
    font-size: 14px;
    .custom-tree-node {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-right: 20px;
      box-sizing: border-box;
      width: 100%;
    }
  }
}
</style>
