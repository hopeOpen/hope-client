<template>
  <div class="role-config__wrapper">
    <header>
      <el-button type="primary" @click="add">新增角色</el-button>
    </header>
    <hope-table
      class="role-table"
      v-model:query="query"
      :tableConfig="tableConfig"
      :colConfig="colConfig"
      :tableData="data"
      :total="total"
      :loading="loading"
      @edit="handleEditor"
      @delete="handleDelete"
    ></hope-table>
    <confirm-dialog
      class="role-confirm-dialog"
      :title="confirmDialogTitle"
      ref="confirmDialogRef"
      :customConfirm="customConfirm"
      :customCancel="customCancel"
    >
      <div class="dialog-input">
        <span class="label">
          <i>*</i>
          角色名称
        </span>
        <el-input v-model="roleData.roleName" placeholder="请输入角色名称"></el-input>
      </div>
      <div class="dialog-input">
        <span class="label">描述</span>
        <el-input v-model="roleData.description" placeholder="角色描述"></el-input>
      </div>
      <div class="dialog-menu">
        <span class="label">
          <i>*</i>
          页面配置
        </span>
        <menu-tree
          ref="menuTreeRef"
          :pageList="menuConfigData"
          :treeProps="treeProps"
          @check-change="handleCheckChange"
        />
      </div>
    </confirm-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { getRoles, addRole, deleteRole, updateRole } from '@/apis/roles';
import { RoleType, MenuType } from '@/types/index';
import { getMenusConfig } from '@/apis/menu';
import HopeTable from '@/views/components/hopeTable/index.vue';
import ConfirmDialog from '@/views/components/confirmDialog.vue';
import MenuTree from './components/menuTree.vue';
import { ElMessage } from 'element-plus';
const menuTreeRef = ref();
const confirmDialogRef = ref();
// table 列展示
const colConfig = [
  {
    label: 'id',
    prop: 'id',
    width: '100px'
  },
  {
    label: '角色',
    prop: 'roleName',
    width: '150px'
  },
  {
    label: '描述',
    prop: 'description'
  }
];
const tableConfig = {
  width: '100%',
  headerCellStyle: {
    background: '#f4f4f4'
  },
  selection: true
};
const total = ref<number>(0);
const query = ref({
  pageSize: 10,
  pageNum: 1
});
watch(
  query,
  () => {
    fetchData();
  },
  { deep: true }
);
const confirmDialogTitle = computed(() => {
  const { id } = roleData.value;
  return id ? '角色编辑' : '新增角色';
});
const loading = ref<boolean>(false);
const data = ref<RoleType[]>([]);
const fetchData = async () => {
  try {
    loading.value = true;
    const result = await getRoles(query.value);
    data.value.length = 0;
    data.value.push(...result.list);
    total.value = result.total;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};
fetchData();
// 页面配置
const menuConfigData = ref<MenuType[]>([]);
let menuConfigMap = new Map();
const treeProps = {
  label: 'name',
  children: 'subMenus'
};
const getMenusConfigAction = async () => {
  try {
    const result = await getMenusConfig();
    menuConfigData.value.length = 0;
    menuConfigData.value.push(...result);
    menuConfigMap = new Map(result.map((item: MenuType) => [item.id, item]));
  } catch (error) {
    console.log(error);
  }
};
getMenusConfigAction();

// 页面配置的回调
const handleCheckChange = (data: MenuType, checked: boolean, indeterminate: boolean) => {
  const menuConfig = roleData.value.menuConfig;
  const { id } = data;
  if (!id) return;
  // 节点的子树中是否有被选中的节点 或 选中的情况
  if ((indeterminate || checked) && !menuConfig.includes(id)) {
    menuConfig.push(id);
  }
  // 未选中的情况下
  if (!checked && !indeterminate) {
    const index = menuConfig.indexOf(id);
    if (index === -1) return;
    menuConfig.splice(index, 1);
  }
};

// 编辑
const handleEditor = async (data: RoleType) => {
  const { id, menuConfig = '[]', roleName, description } = data;
  Object.assign(roleData.value, {
    id,
    menuConfig: JSON.parse(menuConfig as string),
    roleName,
    description
  });
  await confirmDialogRef.value.open();
  // 计算展示的页面配置
  handleCheckedKeys();
};
// 计算展示的页面配置
const handleCheckedKeys = () => {
  const kes: number[] = [];
  const { menuConfig } = roleData.value;
  menuConfig.forEach((id) => {
    const topPageData = menuConfigMap.get(id) || { subMenus: [] };
    // 子页面集合
    const subMenus = topPageData?.subMenus || [];
    if (!subMenus.length) {
      kes.push(id);
    }
  });
  menuTreeRef.value.setCheckedKeys(kes);
};

// 删除
const handleDelete = async (data: { ids: number[] }) => {
  try {
    await deleteRole(data);
    ElMessage({
      type: 'success',
      message: '删除成功'
    });
    fetchData();
  } catch (error) {
    console.log(error);
  }
};

// 新增
const roleData = ref<RoleType>({
  id: '',
  menuConfig: [],
  roleName: '',
  description: ''
});
const add = async () => {
  await getMenusConfigAction();
  await confirmDialogRef.value.open();
};
// 自定义确认事件
const customConfirm = async () => {
  const { id } = roleData.value;
  // id 存在是编辑
  const params = { ...roleData.value };
  try {
    if (id) {
      await updateRole(params);
    } else {
      delete params.id;
      await addRole(params);
    }
    ElMessage({
      type: 'success',
      message: id ? '更新成功' : '新增成功'
    });
    fetchData();
  } catch (error) {
    console.log(error);
  } finally {
    customCancel();
  }
};
// 自定义取消事件
const customCancel = () => {
  confirmDialogRef.value.close();
  init();
};

const init = () => {
  Object.assign(roleData.value, {
    id: '',
    menuConfig: [],
    roleName: '',
    description: ''
  });
};
</script>
<style lang="scss">
.role-config__wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  .role-table {
    margin-top: 20px;
    flex: 1;
  }
  .el-dialog__body {
    padding: 20px;
    .label {
      width: 86px;
      text-align: right;
      margin-right: 10px;
      display: block;
      i {
        color: red;
      }
    }
    .dialog-input {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
    .dialog-menu {
      display: flex;
      .label {
        width: 69px;
        margin-top: 9px;
      }
    }
  }
}
</style>
