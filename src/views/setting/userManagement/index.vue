<template>
  <div class="user-manage__wrap">
    <!-- 操作 搜索 -->
    <user-manage-search @add="handleAddUser" @search="search" @batchDelete="handleBatchDelete" />
    <!-- 表格 -->
    <user-table
      class="table"
      ref="userTableRef"
      :data="userData"
      @sizeChange="handleSizeChange"
      @currentChange="handleCurrentChange"
      @edit="handleEdit"
      @delete="handleDelete"
    />
    <!-- 弹框 新增 编辑-->
    <hope-dialog ref="hopeDialogRef" @confirm="handleConfirm" @cancel="handleCancel">
      <add-form ref="userFormRef" />
    </hope-dialog>
  </div>
</template>

<script lang="ts">
import UserManageSearch from './search.vue';
import UserTable from './userTable.vue';
import { defineComponent, reactive, ref } from 'vue';
import HopeDialog from '@/views/components/dialog.vue';
import AddForm from './addForm.vue';
import { ElMessage } from 'element-plus';
import { AddUserInfoType, UsersParamsType, UpdateUserInfoType } from '@/types/index';
import { getUsers, addUser, getUserDetail, updateUserInfo, deleteUser } from '@/apis/user';
export default defineComponent({
  name: 'UserManagement',
  components: {
    UserManageSearch,
    UserTable,
    HopeDialog,
    AddForm
  },
  setup() {
    const eType = ref('add');
    // template ref
    const hopeDialogRef = ref();
    const userFormRef = ref();
    const userTableRef = ref();
    const params = reactive<UsersParamsType>({
      name: '',
      pageNum: 1,
      pageSize: 10
    });
    const userData = ref();
    // 添加用户
    const handleAddUser = async () => {
      eType.value = 'add';
      // 打开弹框
      await hopeDialogRef.value.open('add');
      userFormRef.value.init('add');
    };

    // 确认提交
    const handleConfirm = () => {
      console.log('handleConfirm', userFormRef.value);
      // 校验表单
      userFormRef.value.userFormRef.validate((valid: boolean) => {
        if (!valid) {
          ElMessage({
            message: '请输入完整',
            type: 'warning'
          });
        } else {
          // 获取数据
          const userData = JSON.parse(JSON.stringify(userFormRef.value.userData));
          if (eType.value === 'edit') {
            updateUser(userData);
          } else {
            saveAction(userData);
          }
        }
      });
    };
    // 取消
    const handleCancel = () => {
      console.log('handleCancel');
      userFormRef.value.init();
      hopeDialogRef.value.close();
    };

    // 持久化用户信息
    const saveAction = async (data: AddUserInfoType) => {
      try {
        await addUser(data);
        ElMessage({
          message: '新增用户成功',
          type: 'success'
        });
        userFormRef.value.init();
        hopeDialogRef.value.close();
        fetchData();
      } catch (error) {
        ElMessage({
          message: `${error}`,
          type: 'error'
        });
        console.log(error);
      }
    };
    const updateUser = async (data: UpdateUserInfoType) => {
      try {
        await updateUserInfo(data);
        ElMessage({
          message: '修改信息成功',
          type: 'success'
        });
        userFormRef.value.init();
        hopeDialogRef.value.close();
        fetchData();
      } catch (error) {
        ElMessage({
          message: `${error}`,
          type: 'error'
        });
      }
    };

    // 获取数据
    const fetchData = async () => {
      try {
        const result = await getUsers(params);
        userData.value = result;
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
    // 搜索
    const search = (val: string) => {
      params.name = val;
      fetchData();
    };
    const handleSizeChange = (size: number) => {
      params.pageSize = size;
      fetchData();
    };
    const handleCurrentChange = (currentPage: number) => {
      params.pageNum = currentPage;
      fetchData();
    };
    const handleEdit = async (data: any) => {
      try {
        const detail = await getUserDetail({ id: data.id });
        // 打开弹框
        await hopeDialogRef.value.open();
        eType.value = 'edit';
        userFormRef.value.init('edit', detail);
      } catch (error) {
        console.log(error);
      }
    };
    const handleBatchDelete = () => {
      const list = [...userTableRef.value.multipleSelection];
      if (!list.length) {
        ElMessage({
          message: '请选择用户',
          type: 'warning'
        });
      } else {
        const ids = list.map((item): string | number => item.id);
        handleDelete({
          ids: ids
        });
      }
    };
    const handleDelete = async (data: any) => {
      try {
        await deleteUser(data);
        userTableRef.value.init();
        fetchData();
        ElMessage({
          message: '删除成功',
          type: 'success'
        });
      } catch (error) {
        console.log(error);
      }
    };
    return {
      userData,
      hopeDialogRef,
      userFormRef,
      userTableRef,
      handleAddUser,
      handleConfirm,
      handleCancel,
      search,
      handleSizeChange,
      handleCurrentChange,
      handleEdit,
      handleDelete,
      handleBatchDelete
    };
  }
});
</script>

<style lang="scss">
.user-manage__wrap {
  padding: 20px;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  background: white;
  .table {
    margin-top: 20px;
  }
}
</style>
