<template>
  <div class="hope-table__block">
    <el-table
      v-bind="props.tableConfig"
      :data="props.tableData"
      style="width: 100%"
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
    <footer class="footer">
      <div>
        <el-button v-if="props.tableConfig.selection && multipleSelection" size="small" @click="handleDelete([], true)">
          批量删除
        </el-button>
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
import { QuestionFilterType, QuestionType } from '@/types/index';
type PropsType = {
  tableData: any[];
  colConfig: any[];
  tableConfig: any;
  query: QuestionFilterType;
  total: number;
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
    ids: batch ? multipleSelection.value.map((item: QuestionType) => item.id) : [data.id]
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
  .el-table__expand-column {
    .cell {
      padding: 0 12px 0 0;
    }
  }
  .footer {
    margin-top: 14px;
    display: flex;
    justify-content: space-between;
  }
}
</style>
