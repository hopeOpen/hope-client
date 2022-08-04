import { createStore } from 'vuex';

import { State } from '@/types/index';

export default createStore<State>({
  state: {
    // 左侧菜单是否折叠
    isCollapse: false,
    // 用户信息
    userInfo: {
      avatar: 'https://i.gtimg.cn/club/item/face/img/2/16022_100.gif',
      name: 'leon'
    }
  },
  getters: {
    isCollapse: (state) => state.isCollapse
  },
  mutations: {
    setCollapse(state) {
      state.isCollapse = !state.isCollapse;
    }
  },
  actions: {},
  modules: {}
});
