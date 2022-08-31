import { createStore } from 'vuex';

import Cookie from 'js-cookie';
interface State {
  isCollapse: boolean;
  userInfo: {
    avatar: string;
    name: string;
  };
}

interface ModulesType {
  [key: string]: any;
}

const modulesFiles = require.context('./modules', true, /\.ts$/);
//  modulesFiles.keys() ==> ['./nav.ts']
const modules = modulesFiles.keys().reduce((modules: ModulesType, modulePath) => {
  // set './nav.ts' => 'nav'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1');
  const value = modulesFiles(modulePath);
  modules[moduleName] = value.default;
  return modules;
}, {});

const store = createStore<State>({
  state: {
    // 左侧菜单是否折叠
    isCollapse: true,
    // 用户信息
    userInfo: {
      avatar: 'https://i.gtimg.cn/club/item/face/img/2/16022_100.gif',
      name: 'leon'
    }
  },
  getters: {
    getToken() {
      return Cookie.get('hope_token');
    }
  },
  mutations: {
    setCollapse(state) {
      state.isCollapse = !state.isCollapse;
    }
  },
  actions: {
    logout() {
      Cookie.remove('hope_token');
    }
  },
  modules
});

export default store;
