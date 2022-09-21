export interface NavType {
  title: string;
  // element plus 图标组件
  icon: string;
  path?: string;
  routeName?: string;
  sign: string;
  children?: Array<NavType>;
}

export const navDatas: Array<NavType> = [
  {
    title: '个人概括',
    icon: 'PieChart',
    path: '/index',
    routeName: 'Index',
    sign: 'manage.menu.index'
  },
  {
    title: '管理中心',
    icon: 'SetUp',
    path: 'management',
    sign: 'manage.menu.management',
    children: [
      {
        title: '个人中心',
        icon: 'User',
        path: '/management/personalCenter',
        routeName: 'PersonalCenter',
        sign: 'manage.menu.personalCenter'
      },
      {
        title: '用户管理',
        icon: 'Monitor',
        path: '/management/userManagement',
        routeName: 'UserManagement',
        sign: 'manage.menu.userManagement'
      },
      {
        title: '角色管理',
        icon: 'Key',
        path: '/management/roleManagement',
        routeName: 'RoleManagement',
        sign: 'manage.menu.roleManagement'
      }
    ]
  },
  {
    title: '学前准备',
    icon: 'Notification',
    path: 'paper',
    sign: 'manage.menu.paper',
    children: [
      {
        title: '试卷管理',
        icon: 'Document',
        path: '/paper/testPaperManage',
        routeName: 'TestPaperManage',
        sign: 'manage.menu.testPaperManage'
      },
      {
        title: '题目管理',
        icon: 'Edit',
        path: '/paper/testQuestion',
        routeName: 'TestQuestion',
        sign: 'manage.menu.testQuestion'
      },
      {
        title: '题库管理',
        icon: 'Collection',
        path: '/paper/questionBank',
        routeName: 'QuestionBank',
        sign: 'manage.menu.questionBank'
      }
    ]
  }
];
