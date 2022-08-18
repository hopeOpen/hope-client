import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import store from '@/store';
import manageRouters from './manage';
import setTingRouters from './setting';
import { navData, NavType } from '@/views/nav/navData';

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
        component: () => import(/* webpackChunkName: "login" */ '../views/notfound/index.vue'),
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

    // 获取用户菜单
    await store.dispatch('getUserMenus', {});
    // 菜单权限key集合
    const menusKeys = store.state.userMenus.map((item: any) => item.sign);
    // 路由集合
    let addRoutes = [...manageRouters(), ...setTingRouters()];
    // 初始化导航菜单
    const authNavData = navData.filter((nav: NavType) => {
      if (nav.subnavs) {
        nav.subnavs = nav.subnavs.filter((sub: NavType) => menusKeys.includes(sub.sign));
      }
      return menusKeys.includes(nav.sign);
    });
    store.dispatch('changeNavsActions', authNavData);
    // 筛选出有权限的路由
    addRoutes = addRoutes.filter((routeItem: RouteRecordRaw) => {
      if (routeItem.children) {
        routeItem.children = routeItem.children.filter((child: RouteRecordRaw) =>
          menusKeys.includes(child?.meta?.sign)
        );
      }
      return menusKeys.includes(routeItem?.meta?.sign || '');
    });
    // 添加路由
    addRoutes.forEach((item) => {
      router.addRoute(item);
    });

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
