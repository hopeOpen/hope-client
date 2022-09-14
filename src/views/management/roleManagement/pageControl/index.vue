<template>
  <div class="menus-wrapper">
    <main class="main">
      <header class="header">
        <span>页面导航</span>
        <el-tooltip class="box-item" effect="dark" content="新增页面" placement="top">
          <el-icon @click="handleAddPage"><CirclePlus /></el-icon>
        </el-tooltip>
      </header>
      <el-tree
        class="menu-tree"
        node-key="id"
        draggable
        default-expand-all
        :allow-drop="allowDrop"
        :allow-drag="true"
        :data="pageList"
        :props="treeProps"
        @node-drop="nodeDrop"
      >
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <span>{{ node.label }}</span>
            <el-popover :width="100" :teleported="false" popper-class="menu-popover" placement="bottom" trigger="click">
              <template #reference>
                <el-icon><CirclePlus /></el-icon>
              </template>
              <template #default>
                <div class="item-operate" @click="handleMenuEditor(data)">编辑</div>
                <div class="item-operate">上方添加</div>
                <div class="item-operate">上方添加</div>
                <div class="item-operate" @click="handleAddPage(data)" v-if="!data.parentId">添加子页面</div>
                <div class="item-operate">删除</div>
              </template>
            </el-popover>
          </span>
        </template>
      </el-tree>
    </main>
    <main class="main">
      <!-- <header>权限功能</header>
      <div v-for="item in pageList" :key="item.sign">s</div> -->
    </main>
    <!-- 编辑/新增 -->
    <confirm-dialog
      class="confirm-dialog"
      ref="confirmDialogRef"
      title="编辑页面"
      :customConfirm="customConfirm"
      :customCancel="customCancel"
    >
      <el-form label-position="left" label-width="100px" :model="params" :rules="rules" ref="ruleFormRef">
        <el-form-item label="页面名称" prop="name">
          <el-input v-model="params.name" />
        </el-form-item>
        <el-form-item label="页面标识" prop="sign">
          <el-input v-model="params.sign" />
        </el-form-item>
      </el-form>
    </confirm-dialog>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue';
import { getMenusConfig } from '@/apis/menu';
import ConfirmDialog from '@/views/components/confirmDialog.vue';
import { MenuType } from '@/types';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import type Node from 'element-plus/es/components/tree/src/model/node';
// import type { DragEvents } from 'element-plus/es/components/tree/src/model/useDragNode';
// import type { DropType } from 'element-plus/es/components/tree/src/tree.type';
import { addMenu, updateMenu } from '@/apis/menu';
const pageList = ref<MenuType[]>([]);
const treeProps = {
  label: 'name',
  children: 'subMenus'
};
// 获取数据
const fetchData = async () => {
  try {
    const result = await getMenusConfig();
    pageList.value.length = 0;
    pageList.value = result;
  } catch (error) {
    console.log(error);
  }
};
fetchData();

// tree
// 判断节点是否能拖拽
const allowDrop = (draggingNode: Node, dropNode: Node) => {
  const currentData = draggingNode.data;
  const currentDropData = dropNode.data;
  // 一级与一级中互相换 二级同。不能跨级换
  // currentData.parentId 存在值 说明是二级页面
  if (currentData.parentId && currentDropData.parentId) {
    return true;
  }
  // 不存在值 说明是一级
  if (!currentData.parentId && !currentDropData.parentId) {
    return true;
  }
};
// 拖拽结束事件
const nodeDrop = (draggingNode: Node, dropNode: Node, location: any) => {
  console.log('nodeDrop', draggingNode, dropNode, location);
  const currentData = draggingNode.data;
  const currentDropData = dropNode.data;
  const { name, sign, parentId } = currentData;
  const { index } = currentDropData;
  currentNode.value = currentData;
  Object.assign(params.value, {
    name,
    sign,
    index,
    parentId
  });
  updateMenuAction();
};

// 弹框
const currentNode = ref();
const confirmDialogRef = ref();
const ruleFormRef = ref<FormInstance>();
const params = ref<any>({
  name: '',
  sign: '',
  index: '',
  parentId: ''
});
const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入页面名称', trigger: 'blur' }],
  sign: [{ required: true, message: '请输入页面标识', trigger: 'blur' }]
});
// 编辑or新增
const type = ref<string | null>();
// 新增页面
const handleAddPage = async (data: any = {}) => {
  console.log('handleAddPage', data);
  const { id, subMenus = [] } = data;
  type.value = 'add';
  await confirmDialogRef.value.open();
  // 是否添加的是子页面
  params.value.parentId = id;

  // parentId 存在代表是二级页面
  params.value.index = id ? subMenus.length : pageList.value.length;
};
// 新增页面请求
const addNewPageAction = async () => {
  try {
    await addMenu(params.value);
    await customCancel();
    await fetchData();
    ElMessage({
      type: 'success',
      message: '添加成功'
    });
  } catch (error) {
    console.log(error);
  }
};

// 更新页面配置
const updateMenuAction = async () => {
  try {
    await updateMenu({
      ...params.value,
      id: currentNode.value.id
    });
    await customCancel();
    await fetchData();
    ElMessage({
      type: 'success',
      message: '更新成功'
    });
  } catch (error) {
    console.log(error);
  }
};

// 编辑页面
const handleMenuEditor = async (data: any) => {
  console.log(data);
  type.value = 'edit';
  currentNode.value = data;
  const { name, sign, index, parentId } = data;
  Object.assign(params.value, {
    name,
    sign,
    index,
    parentId
  });
  await confirmDialogRef.value.message();
};
// 自定义确认事件
const customConfirm = () => {
  if (!validate(ruleFormRef.value)) return;
  // 新增
  if (type.value === 'add') {
    addNewPageAction();
  } else if (type.value === 'edit') {
    updateMenuAction();
  }
};
// 自定义取消事件
const customCancel = () => {
  params.value = { name: '', sign: '', index: '', parentId: '' };
  currentNode.value = null;
  type.value = null;
  confirmDialogRef.value.close();
};
// 校验form表单
const validate = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) return true;
    ElMessage({
      type: 'error',
      message: '输入完整'
    });
    return false;
  });
};
</script>

<style lang="scss">
.menus-wrapper {
  display: flex;
  height: 100%;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .el-icon {
      font-size: 14px;
      cursor: pointer;
    }
  }
  .main {
    flex: 1;
    & > header {
      padding: 6px 20px;
      font-size: 20px;
      background-color: #f0f2f5;
    }
    .menu-tree {
      .el-tree-node__content {
        height: 38px;
        font-size: 14px;
        .custom-tree-node {
          display: flex;
          justify-content: space-between;
          padding-right: 20px;
          box-sizing: border-box;
          width: 100%;
        }
      }
      .menu-popover {
        min-width: 100px;
        padding: 4px 0px;
        .item-operate {
          text-align: center;
          line-height: 36px;
          cursor: pointer;
          &:hover {
            background-color: #ebeffd;
            color: #819bf7;
          }
        }
      }
    }
  }
  .main + .main {
    margin-left: 20px;
  }
  .el-dialog {
    .el-dialog__body {
      padding: 10px 20px 0;
    }
  }
}
</style>
