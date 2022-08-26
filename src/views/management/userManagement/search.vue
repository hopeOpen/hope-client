<template>
  <header class="user-search__block">
    <div>
      <el-button type="primary" @click="add">
        <el-icon class="el-icon--right"><Plus /></el-icon>
        添加
      </el-button>
      <el-button type="danger" @click="batchDelete">
        <el-icon class="el-icon--right"><Delete /></el-icon>
        批量删除
      </el-button>
    </div>
    <div class="search">
      <el-input v-model="name" placeholder="请输入用户名" />
      <el-button type="primary" @click="search">搜索</el-button>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
  name: 'UserManageSearch',
  setup(props, context) {
    const name = ref<string>('');
    const add = () => {
      context.emit('add');
    };
    const search = () => {
      context.emit('search', name);
    };
    const batchDelete = () => {
      context.emit('batchDelete');
    };
    return {
      name,
      add,
      search,
      batchDelete
    };
  }
});
</script>

<style lang="scss">
.user-search__block {
  display: flex;
  justify-content: space-between;
  .search {
    display: flex;
    .el-input {
      margin-right: 10px;
    }
  }
}
</style>
