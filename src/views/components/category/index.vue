<template>
  <div class="category-wrapper e-container">
    <header class="category-header">
      <el-autocomplete
        clearable
        ref="autocomplete"
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
        ref="tree"
        node-key="id"
        :indent="12"
        :data="category"
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
      ref="dialog"
      v-model="dialogVisible"
      :loading="dialogLoading"
      :show-continue-button="dialogShowContinueButton"
      :title="dialogTitle"
      @cancel="handleDialogCancel"
      @confirm="handleDialogConfirm"
      @continue="handleDialogContinue"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import CategoryDialog from './categoryDialog.vue';
// 搜索相关
const content = ref('');
const querySearchAsync = (content: string, cb: any) => {
  console.log(content, cb);
  cb([]);
};
const handleSelect = (node: any) => {
  console.log('handleSelect', node);
};
const handleClear = () => {
  console.log('');
};

// 全部分类
const defaultNode = {
  name: '全部分类',
  id: '',
  categoryLevel: 0
};
const currentNodeKey = ref('');
const dialogNode = ref({});
const handleNodeClick = (node: any) => {
  currentNodeKey.value = node;
};
const dialogVisible = ref(false);
const handleAdd = (node: any) => {
  dialogNode.value = node;
  dialogVisible.value = true;
};

//
const category = ref([
  {
    id: 4,
    categoryName: '信用卡年费调整',
    parentId: 0,
    categoryLevel: 1,
    ruleType: 5,
    description: null,
    children: [
      {
        id: 17,
        categoryName: '信用卡预留手机号码修改',
        parentId: 0,
        categoryLevel: 1,
        ruleType: 5,
        description: null,
        children: []
      }
    ]
  },
  {
    id: 7,
    categoryName: '信用卡预留手机号码修改',
    parentId: 0,
    categoryLevel: 1,
    ruleType: 5,
    description: null,
    children: []
  },
  {
    id: 9,
    categoryName: '信用卡挂失换卡',
    parentId: 0,
    categoryLevel: 1,
    ruleType: 5,
    description: null,
    children: []
  },
  {
    id: 27,
    categoryName: '自助设备吞卡折',
    parentId: 0,
    categoryLevel: 1,
    ruleType: 5,
    description: null,
    children: []
  },
  {
    id: 74,
    categoryName: '信用卡盗刷',
    parentId: 0,
    categoryLevel: 1,
    ruleType: 5,
    description: null,
    children: []
  },
  {
    id: 75,
    categoryName: '信用卡账单地址修改',
    parentId: 0,
    categoryLevel: 1,
    ruleType: 5,
    description: null,
    children: []
  },
  {
    id: 76,
    categoryName: '信用卡积分抵扣费用',
    parentId: 0,
    categoryLevel: 1,
    ruleType: 5,
    description: null,
    children: []
  },
  {
    id: 108,
    categoryName: 'ceshi',
    parentId: 0,
    categoryLevel: 1,
    ruleType: 5,
    description: null,
    children: []
  }
]);
// 展开的节点keys
const defaultExpandedKeys = reactive([] as any[]);
// 分类树字段
const defaultProps = ref({
  children: 'children',
  label: 'categoryName'
});
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
const handleRename = (data: any) => {
  console.log(data);
};
const handleDelete = (data: any) => {
  console.log(data);
};

const handleDialogCancel = () => {
  dialogNode.value = {};
  dialogLoading.value = false;
  dialogVisible.value = false;
  dialogShowContinueButton.value = false;
};
const handleDialogConfirm = (content: any, notClose = false) => {
  console.log(content, notClose);
};
const handleDialogContinue = async () => {
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
