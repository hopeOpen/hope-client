<template>
  <el-popover popper-class="test-popover" ref="testPopoverRef" placement="bottom" trigger="click" :teleported="false">
    <template #reference>
      <el-button size="small" class="test-btn" v-html="label"></el-button>
    </template>
    <el-tree
      ref="treeRef"
      highlight-current
      default-expand-all
      class="filter-tree"
      node-key="id"
      :data="categoryData"
      :props="defaultProps"
      :expand-on-click-node="false"
      @node-click="handleNodeClick"
    />
  </el-popover>
</template>
<script setup lang="ts">
import { ref, reactive, defineEmits, computed, defineProps, watch } from 'vue';
import { categoryList } from '@/apis/category';
import { CategoryType } from '@/types/index';
const emit = defineEmits(['update:categoryId']);
const category = ref<any>();
const props = defineProps({
  categoryId: {
    type: [Number, String],
    default: ''
  }
});
const defaultProps = {
  children: 'children',
  label: 'categoryName'
};
const treeRef = ref();
// 获取分类列表
const categoryData: CategoryType[] = reactive([]); // 分类树字段
const fetchCategory = () => {
  categoryList().then((res) => {
    categoryData.length = 0;
    categoryData.push(...res);
    getConnectLabel(props.categoryId);
  });
};
fetchCategory();

// 获取试题分类名称
const getConnectLabel = (id: string | number) => {
  function bfs(list: any) {
    for (let i = 0; i < list.length; i++) {
      if (list[i].id === id) {
        category.value = list[i];
        return;
      }
      if (list[i].children) {
        bfs(list[i].children);
      }
    }
  }
  bfs(categoryData);
};

const testPopoverRef = ref();
const handleNodeClick = (data: CategoryType) => {
  category.value = data;
  categoryTypeValue.value = data.id;
  testPopoverRef.value.hide();
};

// 设置分类树高亮
const setCurrentKey = (value: number | string) => {
  treeRef.value.setCurrentKey(value);
};

const categoryTypeValue = computed({
  get() {
    return props.categoryId;
  },
  set(val) {
    console.log('==', val);
    setCurrentKey(val);
    emit('update:categoryId', val);
  }
});

watch(
  () => props.categoryId,
  (value) => {
    if (!value) {
      category.value = '';
    }
  }
);

const label = computed(() => {
  if (category.value && category.value.id) {
    return category.value.categoryName;
  } else {
    return '<span class="not">试题分类</span>';
  }
});
</script>
<style lang="scss">
.test-popover {
  padding: 10px 0 !important;
}
.test-btn {
  width: 80px;
  .not {
    color: #a8abb2;
  }
}
</style>
