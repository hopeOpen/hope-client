import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import store from '@/store';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/:catchAll(.*)',
    component: () => import(/* webpackChunkName: "404" */ '@/views/components/layout/index.vue'),
    children: [
      {
        path: '/:catchAll(.*)',
        component: () => import(/* webpackChunkName: "404" */ '../views/notfound/index.vue'),
        meta: {
          key: 'NOTFOUND',
          title: 'PAGE NOT FOUND'
        }
      }
    ]
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

// 不重定向白名单, 一般用于登陆页
const whiteList = ['/login'];
let init = false;
router.beforeEach(async (to, from, next) => {
  try {
    // 判断是否白名单 初始化。
    if (whiteList.includes(to.path) || init) {
      return next();
    }
    // 获取用户信息
    await store.dispatch('getUserInfo');
    // 获取菜单
    await store.dispatch('handleUserMenus');

    // 避免重复处理
    init = true;

    // 解决动态路由刷新页面404问题
    return next({ ...to, replace: true });
  } catch (error) {
    console.log(error);
  } finally {
    next();
  }
});

export default router;
