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
        icon: 'Notification',
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
            icon: 'Edit',
            sign: 'manage.menu.testQuestion'
          }
        },
        {
          // 题库管理
          path: 'questionBank',
          name: 'QuestionBank',
          component: () => import(/* webpackChunkName: "questionBank" */ '../views/paper/questionBank/index.vue'),
          meta: {
            title: '题库管理',
            icon: 'Collection',
            sign: 'manage.menu.questionBank'
          }
        }
      ]
    }
  ];
};
