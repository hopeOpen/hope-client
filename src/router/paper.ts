/**
 * 试卷 试题
 */
import { RouteRecordRaw } from 'vue-router';
export default (): Array<RouteRecordRaw> => {
  return [
    {
      path: '/paper',
      redirect: '/paper/testQuestion',
      component: () => import(/* webpackChunkName: "layout" */ '@/views/components/layout/index.vue'),
      meta: {
        title: '学前准备',
        sign: 'manage.menu.paper'
      },
      children: [
        {
          // 题目管理
          path: 'testQuestion',
          name: 'TestQuestion',
          component: () => import(/* webpackChunkName: "testQuestion" */ '../views/paper/testQuestion/index.vue'),
          meta: {
            title: '题目管理',
            sign: 'manage.menu.testQuestion'
          }
        },
        {
          // 题库管理
          path: 'questionBank',
          name: 'QuestionBank',
          component: () => import(/* webpackChunkName: "testQuestion" */ '../views/paper/questionBank/index.vue'),
          meta: {
            title: '题库管理',
            sign: 'manage.menu.testQuestion'
          }
        }
      ]
    }
  ];
};
