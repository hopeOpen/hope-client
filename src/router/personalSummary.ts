/**
 * 首页路由
 */

import { RouteRecordRaw } from 'vue-router';

export default (): Array<RouteRecordRaw> => {
  return [
    {
      path: '/',
      redirect: '/index',
      component: () => import(/* webpackChunkName: "layout" */ '@/views/components/layout/index.vue'),
      meta: {
        title: '个人概括',
        icon: 'PieChart',
        sign: 'manage.menu.index',
        banAloneShow: true
      },
      children: [
        {
          path: '/index',
          name: 'Index',
          component: () => import(/* webpackChunkName: "home" */ '../views/personalSummary/index.vue'),
          meta: {
            title: '个人概括',
            icon: 'PieChart',
            sign: 'manage.menu.index'
          }
        }
      ]
    }
  ];
};
