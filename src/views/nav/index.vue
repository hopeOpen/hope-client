<template>
  <aside class="aside-wrapper">
    <header class="aside-header">hope</header>
    <el-menu
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      @open="handleOpen"
      @close="handleClose"
      @select="handleSelect"
    >
      <el-menu-item index="1">
        <el-icon><house /></el-icon>
        <span>首页</span>
      </el-menu-item>
      <!-- <el-sub-menu index="1">
        <template #title>
          <el-icon><house /></el-icon>
          <span>首页</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="1-1">item one</el-menu-item>
        </el-menu-item-group>
      </el-sub-menu> -->
    </el-menu>
  </aside>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
export default defineComponent({
  name: 'Nav',
  setup() {
    const store = useStore();
    const router = useRouter();
    const isCollapse = computed(() => {
      return store.state.isCollapse;
    });
    const handleOpen = (key: string, keyPath: string[]) => {
      console.log(key, keyPath);
    };
    const handleClose = (key: string, keyPath: string[]) => {
      console.log(key, keyPath);
    };
    const handleSelect = (val: string) => {
      console.log(val);
      router.push('/');
    };
    return {
      isCollapse,
      handleOpen,
      handleClose,
      handleSelect,
    };
  },
});
</script>

<style lang="scss" scoped>
.aside-wrapper {
  // width: 220px;
  .aside-header {
    height: $top-menu-height;
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: solid 1px var(--el-menu-border-color);
  }
  .el-menu {
    height: 100%;
    &.el-menu-vertical-demo:not(.el-menu--collapse) {
      width: 200px;
    }
  }
}
</style>
