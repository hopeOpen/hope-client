<template>
  <div class="category-wrapper e-container">
    <header class="category-header">
      <el-autocomplete
        clearable
        ref="autocompleteRef"
        v-model="content"
        size="medium"
        suffix-icon="el-icon-search"
        placeholder="请输入内容"
        :maxlength="20"
        :fetch-suggestions="querySearchAsync"
        @select="handleSelect"
        @clear="handleClear"
      >
        <template #default="{ item }">
          <div class="value">{{ item.value }}</div>
          <span class="link">{{ item.link }}</span>
        </template>
      </el-autocomplete>
    </header>
    <main class="category-main">
      <section class="header">
        <h3
          class="all-category hover-primary-color"
          :class="{ 'is-active': !currentNodeKey }"
          @click="handleNodeClick(defaultNode)"
        >
          全部分类
        </h3>
        <span class="btn-add hover-primary-color" @click="handleAdd(defaultNode)">
          <el-icon><CirclePlus /></el-icon>
        </span>
      </section>

      <el-tree
        highlight-current
        class="tree"
        ref="treeRef"
        node-key="id"
        :indent="12"
        :data="props.category"
        :default-expanded-keys="defaultExpandedKeys"
        :current-node-key="currentNodeKey"
        :props="defaultProps"
        @node-click="handleNodeClick"
        @node-expand="nodeExpand"
        @node-collapse="nodeCollapse"
      >
        <template #default="{ node, data }">
          <div class="custom-tree-node" @mouseover.passive="handleMouseOver(node)" @mouseout.passive="handleMouseOut">
            <span class="node-label" :title="data.categoryName">
              {{ data.categoryName }}
            </span>
            <!-- 操作弹窗 -->
            <el-popover
              popper-class="category-tree--popper"
              placement="bottom"
              trigger="hover"
              width="100"
              :close-delay="0"
              @show="handlePopeverShow(node)"
              @hide="handlePopeverHide"
            >
              <template #reference>
                <!-- 图标 -->
                <span class="node-popper-refer" :style="getPopoverStyle(node.id)">
                  <el-icon><MoreFilled /></el-icon>
                </span>
              </template>
              <!-- 重命名选项 -->
              <el-button type="text" @click.stop="handleRename(data)">重命名</el-button>
              <!-- 新建子分类选项 -->
              <el-button type="text" v-if="data.categoryLevel <= 2" @click.stop="handleAdd(data)">新建子分类</el-button>
              <!-- 删除选项 -->
              <el-button type="text" @click.stop="handleDelete(data)">删除</el-button>
            </el-popover>
          </div>
        </template>
      </el-tree>
    </main>
    <!-- 弹窗(新建分类 重命名) -->
    <category-dialog
      ref="categoryDialogRef"
      v-model="dialogVisible"
      :loading="dialogLoading"
      :show-continue-button="dialogShowContinueButton"
      :title="dialogTitle"
      @cancel="handleDialogCancel"
      @confirm="handleDialogConfirm"
      @continue="handleDialogContinue"
    />
    <confirm-dialog ref="confirmDialogRef">
      <div class="title">
        <i class="el-icon-warning" />
        <span class="text">
          {{ `确定删除分类"${dialogNode.categoryName}"吗?` }}
        </span>
      </div>
      <span class="description">删除后不可恢复</span>
    </confirm-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, defineProps, defineEmits, watch } from 'vue';
import CategoryDialog from './categoryDialog.vue';
import ConfirmDialog from '@/views/components/confirmDialog.vue';
import { addCategory, updateCategory, deleteCategory, searchCategory } from '@/apis/category';
import { ElMessage } from 'element-plus';
const emit = defineEmits(['fetch', 'update:categoryId']);
const confirmDialogRef = ref();
// 搜索相关
const content = ref('');
// 模糊搜索
const querySearchAsync = async (content: string, cb: any) => {
  if (content.trim() === '') {
    return cb([]);
  }
  const list =
    (await searchCategory({
      categoryName: content.trim()
    })) || [];
  list.forEach((item: any) => {
    item.value = item.categoryName;
  });
  cb(list);
};
const treeRef = ref();
// 展开的节点keys
let defaultExpandedKeys = reactive([] as any[]);
const handleSelect = (node: any) => {
  const set = new Set(defaultExpandedKeys);
  set.add(node.id);
  defaultExpandedKeys = Array.from(set);
  treeRef.value.setCurrentKey(node.id);
  emit('update:categoryId', node.id);
};
const autocompleteRef = ref();
const handleClear = () => {
  autocompleteRef.value.activated = true;
};
// 全部分类
const defaultNode = {
  name: '全部分类',
  id: '',
  categoryLevel: 0
};
const currentNodeKey = ref();
const dialogNode: any = ref({});
const handleNodeClick = (node: any) => {
  currentNodeKey.value = node;
};
const dialogVisible = ref(false);
const handleAdd = (node: any) => {
  dialogNode.value = node;
  dialogNode.value.type = 'add';
  dialogVisible.value = true;
};

const props = defineProps({
  category: {
    type: Object
  },
  categoryId: {
    type: String,
    default: ''
  }
});

watch(
  currentNodeKey,
  (val) => {
    emit('update:categoryId', val.id);
  },
  { deep: true }
);

// 分类树字段
const defaultProps = {
  children: 'children',
  label: 'categoryName'
};
// 在节点展开是添加到默认展开数组
const nodeExpand = (data: any) => {
  defaultExpandedKeys.push(data.id);
};
// 收起时删除数组里对应选项
const nodeCollapse = (data: any) => {
  defaultExpandedKeys.splice(defaultExpandedKeys.indexOf(data.id), 1);
};

const dialogTitle = ref('新建一级分类');
const dialogLoading = ref(false);
const dialogShowContinueButton = ref(true);
const showMenu = ref(false);
// 当前hover的节点
const currentHoverNode = ref(-1);
// 当前popever显示的节点
const currentPopNode = ref(-1);
// 显示操作图标
const handleMouseOver = (node: any) => {
  if (showMenu.value) return;
  currentHoverNode.value = node.id;
};
// 隐藏操作图标
const handleMouseOut = () => {
  if (showMenu.value) return;
  currentHoverNode.value = -1;
};
const handlePopeverShow = (node: any) => {
  currentPopNode.value = node.id;
  showMenu.value = true;
};
const handlePopeverHide = () => {
  currentPopNode.value = -1;
  showMenu.value = false;
};
// 控制节点操作菜单的显示
const getPopoverStyle = (id: string | number) => {
  return currentHoverNode.value === id || currentPopNode.value === id ? 'transform: scale(1);' : '';
};
const categoryDialogRef = ref();
// 重命名
const handleRename = (data: any) => {
  console.log(data);
  dialogNode.value = data;
  dialogNode.value.type = 'edit';
  dialogVisible.value = true;
  dialogTitle.value = '重命名';
  categoryDialogRef.value.setContent(data.categoryName);
  dialogShowContinueButton.value = false;
};
const handleDelete = async (data: any) => {
  dialogNode.value = data;
  await confirmDialogRef.value.message();
  deleteCategory({ id: data.id })
    .then(() => {
      ElMessage({
        type: 'success',
        message: '删除分类成功'
      });
      emit('fetch');
    })
    .catch((error) => {
      console.log(error);
    });
};

const handleDialogCancel = () => {
  dialogNode.value = {};
  dialogLoading.value = false;
  dialogVisible.value = false;
  dialogShowContinueButton.value = false;
};

// 新增或编辑
const handleDialogConfirm = async (content: any, notClose = false) => {
  try {
    dialogLoading.value = true;
    const { id, categoryLevel, parentId, type } = dialogNode.value;
    if (type === 'add') {
      await addCategory({
        categoryName: content,
        categoryLevel: categoryLevel + 1,
        parentId: id
      });
      ElMessage({
        type: 'success',
        message: '新增分类成功'
      });
    } else {
      await updateCategory({
        categoryName: content,
        categoryLevel,
        parentId,
        id
      });
      ElMessage({
        type: 'success',
        message: '编辑分类成功'
      });
    }
    if (!notClose) {
      dialogVisible.value = false;
    }
    emit('fetch');
  } catch (error) {
    console.log(error);
  } finally {
    dialogLoading.value = false;
  }
};
// 保存并新建下一个
const handleDialogContinue = async (content: string) => {
  try {
    await handleDialogConfirm(content, true);
  } catch (error) {
    console.log(error);
  } finally {
    dialogLoading.value = false;
  }
};
</script>

<style lang="scss">
.category-wrapper {
  box-sizing: border-box;
  display: flex;
  flex-flow: column;
  width: 240px;
  height: 100%;

  .category-main {
    flex: 1;
    display: flex;
    flex-flow: column;
    margin-top: 10px;
    padding-top: 2px;
    overflow: hidden;

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .all-category {
        margin: 0;
        font-size: 14px;
        line-height: 22px;
        font-weight: 400;
        cursor: pointer;
        color: rgba(0, 0, 0, 0.64);

        &.is-active {
          color: #1a8dff;
        }
      }
      .btn-add {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        color: #999;
        background: #fff;
        border-radius: 50%;
        cursor: pointer;
        margin-left: 4px;

        .el-icon {
          font-size: 20px;
        }
      }
    }

    .tree {
      margin-top: 10px;
      flex: 1;
      background: transparent;
      overflow: auto;
      overflow-x: hidden;

      .el-tree-node__content {
        &::before,
        &::after {
          width: 0;
        }
      }
    }

    // 自定义节点
    .custom-tree-node {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      overflow: hidden;

      .node-label {
        flex: 1;
        margin-left: 4px;
        font-size: 14px;
        line-height: 22px;
        @include singleline-ellipsis();
      }

      .node-popper-refer {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 20px;
        height: 20px;
        margin-left: 4px;
        margin-right: 4px;
        border-radius: 50%;
        background: #e8ebeb;
        transform: scale(0);

        .iconfont {
          font-size: 14px;
          color: #999;
        }
      }
    }

    .el-tree-node__content {
      height: 38px;
      color: rgba(0, 0, 0, 0.64);
      overflow: hidden;
      @include default-transition(background);

      &:hover {
        background: #f7f7f7;
      }

      // hack: 左右增加padding，但是不能影响tree组件的缩进
      &::before,
      &::after {
        content: '';
        display: inline-block;
        width: 24px;
        background: transparent;
      }
    }
    .el-tree-node__expand-icon {
      font-size: 16px;
      &:not(.is-leaf) {
        color: #292929;
      }
      &.expanded {
        transform: rotate(90deg) translateX(-1px);
      }
    }
  }
}

// 弹窗样式
.category-tree--popper {
  min-width: 100px !important;
  width: 100px !important;
  padding: 16px 11px;

  .el-button--text {
    display: block;
    margin: 0;
    padding: 0;
    border: none;
    font-size: 14px;
    color: #333;
    @include default-transition(color);

    &:not(:first-of-type) {
      margin-top: 16px;
    }

    &:hover {
      color: #1a8dff;
    }
  }
}
</style>
