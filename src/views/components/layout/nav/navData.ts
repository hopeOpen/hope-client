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
    path: 'management',
    sign: 'manage.menu.management',
    subnavs: [
      {
        name: '个人中心',
        icon: '',
        path: '/management/personalCenter',
        routeName: 'PersonalCenter',
        sign: 'manage.menu.personalCenter'
      },
      {
        name: '用户管理',
        icon: '',
        path: '/management/userManagement',
        routeName: 'UserManagement',
        sign: 'manage.menu.userManagement'
      },
      {
        name: '角色管理',
        icon: '',
        path: '/management/roleManagement',
        routeName: 'RoleManagement',
        sign: 'manage.menu.roleManagement'
      }
    ]
  },
  {
    name: '学前准备',
    icon: '',
    path: 'paper',
    sign: 'manage.menu.paper',
    subnavs: [
      {
        name: '试卷管理',
        icon: '',
        path: '/paper/testPaperManage',
        routeName: 'TestPaperManage',
        sign: 'manage.menu.testPaperManage'
      },
      {
        name: '题目管理',
        icon: '',
        path: '/paper/testQuestion',
        routeName: 'TestQuestion',
        sign: 'manage.menu.testQuestion'
      },
      {
        name: '题库管理',
        icon: '',
        path: '/paper/questionBank',
        routeName: 'QuestionBank',
        sign: 'manage.menu.questionBank'
      }
    ]
  }
];
