/**
 * 设置路由
 */
import { RouteRecordRaw } from 'vue-router';
export default (): Array<RouteRecordRaw> => {
  return [
    {
      path: '/setting',
      redirect: '/setting/personalCenter',
      component: () => import(/* webpackChunkName: "layout" */ '@/views/components/layout/index.vue'),
      meta: {
        title: '管理中心',
        sign: 'manage.menu.setting'
      },
      children: [
        {
          // 个人中心
          path: 'personalCenter',
          name: 'PersonalCenter',
          component: () => import(/* webpackChunkName: "personalCenter" */ '../views/setting/personalCenter/index.vue'),
          meta: {
            title: '个人中心',
            sign: 'manage.menu.personalCenter'
          }
        },
        {
          // 用户管理
          path: 'userManagement',
          name: 'UserManagement',
          component: () => import(/* webpackChunkName: "userManagement" */ '../views/setting/userManagement/index.vue'),
          meta: {
            title: '用户管理',
            sign: 'manage.menu.userManagement'
          }
        }
      ]
    }
  ];
};
