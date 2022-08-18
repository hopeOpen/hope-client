import { createStore } from 'vuex';

// import { State } from '@/types/index';
import { getUserMenus } from '@/apis/user';
import Cookie from 'js-cookie';
import { NavType } from '@/views/nav/navData';

interface State {
  isCollapse: boolean;
  userInfo: {
    avatar: string;
    name: string;
  };
  userMenus: any;
  navs: Array<NavType>;
}

export default createStore<State>({
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
    }
  },
  modules: {}
});
