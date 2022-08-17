import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '../views/home/index.vue')
  },
  {
    // 个人中心
    path: '/setting/personalCenter',
    name: 'PersonalCenter',
    component: () => import(/* webpackChunkName: "personalCenter" */ '../views/setting/personalCenter/index.vue')
  },
  {
    // 用户管理
    path: '/setting/userManagement',
    name: 'UserManagement',
    component: () => import(/* webpackChunkName: "userManagement" */ '../views/setting/userManagement/index.vue')
  },
  {
    // 登陆
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/login/index.vue'),
    meta: {
      isShow: false
    }
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
