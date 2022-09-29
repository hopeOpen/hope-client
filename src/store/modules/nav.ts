/**
 * 菜单类
 */
import { getUserMenus } from '@/apis/menu';
import { RouteRecordRaw } from 'vue-router';
import router from '@/router';
import personalSummaryRouters from '@/router/personalSummary';
import managementRouters from '@/router/management';
import paperRouters from '@/router/paper';
import { NavType, NavDataType, MenuType } from '@/types/index';

interface NavState {
  navs: Array<NavType>;
  userMenus: MenuType[];
}
const state: NavState = {
  // 左侧菜单
  navs: [],
  // 用户权限菜单
  userMenus: []
};

const getters = {};

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
  async handleUserMenus({ state, dispatch }: any) {
    // 获取用户菜单
    await dispatch('getUserMenus', {});
    // 菜单权限key集合
    const menusKeys = state.userMenus.map((item: MenuType) => item.sign);
    const menuMap = new Map(state.userMenus.map((item: MenuType) => [item.sign, item]));

    // 路由集合
    let addRoutes = [...personalSummaryRouters(), ...managementRouters(), ...paperRouters()];
    // TODO: 暂时注释
    // 初始化导航菜单
    // const authNavData = navDatas.filter((nav: NavType) => {
    //   if (nav.children) {
    //     let defaultSubnav = [...nav.children];
    //     defaultSubnav = defaultSubnav.filter((sub: NavType) => menusKeys.includes(sub.sign));
    //     if (defaultSubnav.length) {
    //       nav.children = defaultSubnav;
    //     }
    //   }
    //   return menusKeys.includes(nav.sign);
    // });
    // console.log('authNavData', authNavData, navDatas);
    // await dispatch('changeNavsActions', authNavData);
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

    // 设置路由index
    const authNavData = JSON.parse(JSON.stringify(addRoutes));
    authNavData.forEach((item: NavDataType) => {
      const value: any = menuMap.get(item.meta.sign) || { index: 0 };
      item.meta.index = value.index;
      if (item.children) {
        item.children.forEach((child: NavDataType) => {
          child.meta.index = (menuMap.get(child.meta.sign) as any).index || 0;
        });
      }
    });
    // 路由排序
    authNavData.sort((a: NavDataType, b: NavDataType) => {
      if (a.children) {
        a.children.sort((childA: NavDataType, childB: NavDataType) => {
          return childA.meta.index - childB.meta.index;
        });
      }
      if (b.children) {
        b.children.sort((childA: NavDataType, childB: NavDataType) => {
          return childA.meta.index - childB.meta.index;
        });
      }
      return a.meta.index - b.meta.index;
    });
    const navData = authNavData.map((item: NavDataType) => {
      const { banAloneShow } = item.meta;
      const defaultValue: NavType = {
        title: item.meta.title,
        icon: item.meta.icon,
        path: item.path
      };
      if (banAloneShow) {
        defaultValue.path = item.redirect;
      } else {
        defaultValue.children = item.children?.map((child: NavDataType) => {
          return {
            title: child.meta.title,
            icon: child.meta.icon,
            path: item.path === '/' ? child.path : `${item.path}/${child.path}`
          };
        });
      }
      return defaultValue;
    });
    await dispatch('changeNavsActions', navData);
  }
};

export default {
  namespace: true,
  state,
  getters,
  mutations,
  actions
};
