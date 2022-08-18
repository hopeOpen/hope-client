export interface NavType {
  name: string;
  icon: string;
  path?: string;
  routeName?: string;
  sign: string;
  subnavs?: Array<NavType>;
}

export const navData: Array<NavType> = [
  {
    name: '个人概括',
    icon: '',
    path: '/index',
    routeName: 'Index',
    sign: 'manage.menu.index'
  },
  {
    name: '管理中心',
    icon: '',
    sign: 'manage.menu.setting',
    subnavs: [
      {
        name: '个人中心',
        icon: '',
        path: '/setting/personalCenter',
        routeName: 'PersonalCenter',
        sign: 'manage.menu.personalCenter'
      },
      {
        name: '用户管理',
        icon: '',
        path: '/setting/userManagement',
        routeName: 'UserManagement',
        sign: 'manage.menu.userManagement'
      }
    ]
  }
];
