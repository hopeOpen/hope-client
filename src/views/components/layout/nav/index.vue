<template>
  <aside class="aside-wrapper">
    <header class="aside-header">hope</header>
    <el-menu
      class="el-menu-vertical-demo"
      mode="vertical"
      :collapse="isCollapse"
      :default-active="activeMenu"
      :collapse-transition="true"
      :unique-opened="false"
      @select="handleSelect"
    >
      <template v-for="nav in navs">
        <el-menu-item :index="nav.path" :key="nav.path" v-if="!nav.children">
          <el-icon>
            <component :is="nav.icon"></component>
          </el-icon>
          <span>{{ nav.title }}</span>
        </el-menu-item>
        <el-sub-menu v-else :key="`${nav.sign}-`" :index="nav.path">
          <template #title>
            <el-icon>
              <component :is="nav.icon"></component>
            </el-icon>
            <span>{{ nav.title }}</span>
          </template>
          <el-menu-item-group>
            <el-menu-item :index="childNav.path" v-for="childNav in nav.children" :key="childNav.sign">
              <el-icon>
                <component :is="childNav.icon"></component>
              </el-icon>
              <span>{{ childNav.title }}</span>
            </el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
      </template>
    </el-menu>
  </aside>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
const store = useStore();
const router = useRouter();
const route = useRoute();
const handleSelect = (val: string) => {
  router.push(val);
};
const isCollapse = computed(() => store.state.isCollapse);
const activeMenu = computed(() => route.path);
const navs = computed(() => store.state.nav.navs);
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
