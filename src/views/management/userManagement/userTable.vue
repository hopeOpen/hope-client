<template>
  <el-table
    class="user-table"
    ref="multipleTableRef"
    :data="list"
    style="width: 100%"
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="55" />
    <el-table-column label="id" width="100">
      <template #default="scope">{{ scope.row.id }}</template>
    </el-table-column>
    <el-table-column label="用户名" width="150">
      <template #default="scope">{{ scope.row.name }}</template>
    </el-table-column>
    <el-table-column property="email" width="170" label="邮箱" />
    <el-table-column property="role" label="角色" show-overflow-tooltip />
    <el-table-column label="操作" width="120">
      <template #default="scope">
        <el-button type="primary" link @click="handleEdit(scope.row)">编辑</el-button>
        <el-popconfirm
          confirm-button-text="确定"
          cancel-button-text="取消"
          :icon="InfoFilled"
          icon-color="#626AEF"
          :title="`确认删除“${scope.row.name}”账户`"
          @confirm="handleDelete(scope.row)"
        >
          <template #reference>
            <el-button type="danger" link>删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <div class="pagination">
    <el-pagination
      v-model:currentPage="paginationQuery.pageNum"
      :page-sizes="[10, 20, 30, 50]"
      :small="small"
      layout="total, sizes, prev, pager, next"
      :total="paginationQuery.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, reactive } from 'vue';
interface User {
  id: string | number;
  name: string;
  email: string;
  role: number;
  updatedTime: string;
}
export default defineComponent({
  name: 'UserTable',
  props: {
    data: {
      type: Object,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      default: () => {}
    }
  },
  setup(props, { emit, expose }) {
    const paginationQuery = reactive({
      pageNum: 1,
      pageSize: 10,
      total: 0
    });
    paginationQuery.total = props?.data?.total || 0;
    const multipleSelection = ref<User[]>([]);
    const handleSelectionChange = (val: User[]) => {
      multipleSelection.value = val;
    };
    // 列表数据
    const list = computed(() => {
      return props?.data?.list || [];
    });
    const handleSizeChange = (size: number) => {
      emit('sizeChange', size);
    };
    const handleCurrentChange = (currentPage: number) => {
      emit('currentChange', currentPage);
    };
    const handleEdit = (data: any) => {
      emit('edit', data);
    };
    const handleDelete = (data: any) => {
      emit('delete', {
        ids: [data.id]
      });
    };
    const init = () => {
      multipleSelection.value = [];
    };
    expose({
      multipleSelection,
      init
    });
    return {
      list,
      props,
      paginationQuery,
      handleSelectionChange,
      handleSizeChange,
      handleCurrentChange,
      handleEdit,
      handleDelete
    };
  }
});
</script>

<style lang="scss">
.user-table {
  margin-top: 20px;
}
.pagination {
  padding: 10px 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: row-reverse;
}
</style>
