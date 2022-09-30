<template>
  <el-row class="top-menu">
    <el-col class="menu-left" :span="8">
      <!-- 左侧菜单开关 -->
      <el-icon class="icon" :class="switchStyle" @click="changeCollapse">
        <Expand :class="isCollapse" />
      </el-icon>
    </el-col>
    <el-col :span="8"></el-col>
    <el-col class="menu-right" :span="8">
      <!-- 顶部右侧菜单 -->
      <el-dropdown @command="selectMenu">
        <span class="el-dropdown-link">
          <img class="avatar" :src="userInfo.avatar" alt="" />
          <span class="name">{{ userInfo.name }}</span>
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="item in menus" :key="item.path" :command="item.path">
              {{ item.title }}
            </el-dropdown-item>
            <el-dropdown-item divided @click="logout">
              <span style="display: block">退出登陆</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { computed, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';
const { commit, getters, dispatch } = useStore();
const router = useRouter();
const route = useRoute();

// 菜单
const menus = reactive([
  {
    title: '个人中心',
    path: '/setting/personalCenter'
  }
]);
// 设置按钮icon样式
const switchStyle = computed(() => {
  return getters['getIsCollapse'] ? 'open-style' : 'close-style';
});
const userInfo = computed(() => getters['getUserInfo']);

// 修改左侧菜单是否闭合
const changeCollapse = () => {
  commit('setCollapse');
};

// 选择下拉菜单
const selectMenu = (val: string) => {
  router.push(val);
};

// 退出登陆
const logout = async () => {
  await dispatch('logout');
  router.push(`/login?redirect=${route.fullPath}`);
};
</script>

<style lang="scss" scoped>
.top-menu {
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
  border-bottom: solid 1px var(--el-menu-border-color);
  padding: 0 $common-padding;
  box-sizing: border-box;
  .el-col {
    display: flex;
    align-items: center;
  }
  .menu-left {
    font-size: 20px;
    height: $top-menu-height;
    cursor: pointer;
    .icon {
      cursor: pointer;
      font-weight: 500;
    }
    .close-style {
      transform: rotate(180deg);
    }
  }
  .menu-right {
    flex-direction: row-reverse;
    .el-dropdown-link {
      display: flex;
      align-items: center;
      .avatar {
        height: 38px;
        width: 38px;
        object-fit: cover;
        border-radius: 50%;
        margin-right: 10px;
      }
    }
  }
}
</style>
