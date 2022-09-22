/**
 * 设置路由
 */
import { RouteRecordRaw } from 'vue-router';
export default (): Array<RouteRecordRaw> => {
  return [
    {
      path: '/management',
      redirect: '/management/personalCenter',
      component: () => import(/* webpackChunkName: "layout" */ '@/views/components/layout/index.vue'),
      meta: {
        title: '管理中心',
        icon: 'SetUp',
        sign: 'manage.menu.management'
      },
      children: [
        {
          // 个人中心
          path: 'personalCenter',
          name: 'PersonalCenter',
          component: () =>
            import(/* webpackChunkName: "personalCenter" */ '../views/management/personalCenter/index.vue'),
          meta: {
            title: '个人中心',
            icon: 'User',
            sign: 'manage.menu.personalCenter'
          }
        },
        {
          // 用户管理
          path: 'userManagement',
          name: 'UserManagement',
          component: () =>
            import(/* webpackChunkName: "userManagement" */ '../views/management/userManagement/index.vue'),
          meta: {
            title: '用户管理',
            icon: 'Monitor',
            sign: 'manage.menu.userManagement'
          }
        },
        {
          // 角色管理
          path: 'roleManagement',
          name: 'RoleManagement',
          component: () =>
            import(/* webpackChunkName: "roleManagement" */ '../views/management/roleManagement/index.vue'),
          meta: {
            title: '角色管理',
            icon: 'Key',
            sign: 'manage.menu.roleManagement'
          }
        }
      ]
    }
  ];
};
