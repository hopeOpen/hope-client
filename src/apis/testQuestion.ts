import { $post } from './base';

// 添加试题
export const addQuestion = (params: any) => {
  return $post('/paper/add-question', params);
};
