<template>
  <el-tree
    ref="menuTreeRef"
    class="menu-tree"
    node-key="id"
    show-checkbox
    default-expand-all
    :data="pageList"
    :props="treeProps"
    :default-checked-keys="checkedKeysValve"
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
import { defineProps, defineEmits, ref, toRefs, defineExpose } from 'vue';
import { MenuType } from '@/types/index';
const props = defineProps({
  pageList: {
    type: Array,
    default: () => []
  },
  treeProps: {
    type: Array,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    default: () => {}
  }
});
const { pageList, treeProps } = toRefs(props);
const menuTreeRef = ref();
const emit = defineEmits(['check-change']);

// 设置目前选中的节点，使用此方法必须设置 node-key 属性
const setCheckedKeys = (kes: number[]) => {
  menuTreeRef.value.setCheckedKeys(kes);
};

defineExpose({
  setCheckedKeys
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
