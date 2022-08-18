/**
 * 菜单类
 */
import { NavType } from '@/views/nav/navData';
import { getUserMenus } from '@/apis/user';
import { RouteRecordRaw } from 'vue-router';
import router from '@/router';
import manageRouters from '@/router/manage';
import setTingRouters from '@/router/setting';
import { navData } from '@/views/nav/navData';

interface NavState {
  navs: Array<NavType>;
  userMenus: any;
}

const state: NavState = {
  // 左侧菜单
  navs: [],
  // 用户权限菜单
  userMenus: []
};

const mutations = {
  changeUserMenus(state: NavState, payload = []) {
    state.userMenus = payload;
  },
  changeNavs(state: NavState, payload = []) {
    state.navs = payload;
  }
};

const actions = {
  // 获取角色菜单
  getUserMenus(store: any, payload = {}) {
    return new Promise<void>((resolve, reject) => {
      getUserMenus(payload).then(
        (response) => {
          store.commit('changeUserMenus', response);
          resolve();
        },
        (error) => {
          reject(error);
        }
      );
    });
  },
  // 初始化菜单
  changeNavsActions(store: any, payload: any) {
    store.commit('changeNavs', payload);
  },
  // 处理用户菜单
  async handleUserMenus({ dispatch }: any) {
    // 获取用户菜单
    await dispatch('getUserMenus', {});
    // 菜单权限key集合
    const menusKeys = state.userMenus.map((item: any) => item.sign);
    // 路由集合
    let addRoutes = [...manageRouters(), ...setTingRouters()];
    // 初始化导航菜单
    const authNavData = navData.filter((nav: NavType) => {
      if (nav.subnavs) {
        nav.subnavs = nav.subnavs.filter((sub: NavType) => menusKeys.includes(sub.sign));
      }
      return menusKeys.includes(nav.sign);
    });
    dispatch('changeNavsActions', authNavData);
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
  }
};

export default {
  namespace: true,
  state,
  mutations,
  actions
};
