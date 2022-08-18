import { createStore } from 'vuex';

// import { State } from '@/types/index';
import { getUserMenus } from '@/apis/user';
import Cookie from 'js-cookie';
import { NavType } from '@/views/nav/navData';

import { RouteRecordRaw } from 'vue-router';
import router from '@/router';
import manageRouters from '@/router/manage';
import setTingRouters from '@/router/setting';
import { navData } from '@/views/nav/navData';

interface State {
  isCollapse: boolean;
  userInfo: {
    avatar: string;
    name: string;
  };
  userMenus: any;
  navs: Array<NavType>;
}

const store = createStore<State>({
  state: {
    // 左侧菜单是否折叠
    isCollapse: false,
    // 用户信息
    userInfo: {
      avatar: 'https://i.gtimg.cn/club/item/face/img/2/16022_100.gif',
      name: 'leon'
    },
    // 用户权限菜单
    userMenus: [],
    // 左侧菜单
    navs: []
  },
  getters: {
    getToken() {
      return Cookie.get('hope_token');
    }
  },
  mutations: {
    setCollapse(state) {
      state.isCollapse = !state.isCollapse;
    },
    changeUserMenus(state, payload = []) {
      state.userMenus = payload;
    },
    changeNavs(state, payload = []) {
      state.navs = payload;
    }
  },
  actions: {
    // 获取角色菜单
    getUserMenus({ commit }, payload) {
      return new Promise<void>((resolve, reject) => {
        getUserMenus(payload).then(
          (response) => {
            commit('changeUserMenus', response);
            resolve();
          },
          (error) => {
            reject(error);
          }
        );
      });
    },
    // 初始化菜单
    changeNavsActions({ commit }, payload) {
      commit('changeNavs', payload);
    },
    // 处理用户菜单
    async handleUserMenus() {
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
    },
    logout() {
      Cookie.remove('hope_token');
    }
  },
  modules: {}
});

export default store;
