<template>
  <div class="hope-table__block" v-loading="loading" element-loading-text="拼命加载中。。。">
    <div class="table-wrap">
      <el-table
        v-bind="props.tableConfig"
        :data="props.tableData"
        style="width: 100%"
        height="100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" v-if="props.tableConfig.selection" width="38px" />
        <template v-for="item in props.colConfig">
          <slot v-if="item.slot" :name="item.slot" />
          <el-table-column v-else v-bind="item" :key="item.prop"></el-table-column>
        </template>
        <el-table-column label="操作" width="120px">
          <template #default="scope">
            <el-button type="primary" link @click="handleEdit(scope.row)">编辑</el-button>
            <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="取消"
              icon-color="#626AEF"
              title="确认删除?"
              @confirm="handleDelete(scope.row, false)"
            >
              <template #reference>
                <el-button type="danger" link>删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <footer class="footer">
      <div>
        <el-popconfirm
          confirm-button-text="确定"
          cancel-button-text="取消"
          icon-color="#626AEF"
          title="确认批量删除?"
          @confirm="handleDelete([], true)"
        >
          <template #reference>
            <el-button v-if="props.tableConfig.selection && multipleSelection" size="small">批量删除</el-button>
          </template>
        </el-popconfirm>
      </div>
      <el-pagination
        v-model:currentPage="queryValue.pageNum"
        layout="total, sizes, prev, pager, next, jumper"
        small="small"
        :total="props.total"
        :page-sizes="[10, 20, 50, 100]"
        @size-change="handleSizeChange"
        @current-change="handleChange"
      ></el-pagination>
    </footer>
  </div>
</template>
<script setup lang="ts">
import { defineProps, computed, defineEmits, ref } from 'vue';
type PropsType = {
  tableData: any[];
  colConfig: any[];
  tableConfig: any;
  query: any;
  total: number;
  loading?: boolean;
};
const props = defineProps<PropsType>();
const emit = defineEmits(['update:query', 'currentChange', 'sizeChange', 'edit', 'delete']);
const queryValue = computed({
  get() {
    return props.query;
  },
  set(val) {
    emit('update:query', val);
  }
});

const handleEdit = (data: any) => {
  emit('edit', data);
};
const handleDelete = (data: any, batch: boolean) => {
  emit('delete', {
    ids: batch ? multipleSelection.value.map((item: any) => item.id) : [data.id]
  });
};

const handleSizeChange = (val: number) => {
  queryValue.value.pageSize = val;
  emit('sizeChange', val);
};
const handleChange = (val: number) => {
  queryValue.value.pageNum = val;
  emit('currentChange', val);
};

// 批量删除
const multipleSelection = ref();
const handleSelectionChange = (val: any[]) => {
  console.log(val);
  multipleSelection.value = val.length ? val : '';
};
</script>
<style lang="scss">
.hope-table__block {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .table-wrap {
    flex: 1;
    overflow: hidden;
    .el-table {
      flex: 1;
    }
    .el-table__expand-column {
      .cell {
        padding: 0 12px 0 0;
      }
    }
  }
  .footer {
    margin-top: 14px;
    display: flex;
    justify-content: space-between;
  }
}
</style>
