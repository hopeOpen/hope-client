import { $post } from './base';
import { QuestionType, QuestionFilterType } from '../types/index';

// 添加试题
export const addQuestion = async (params: QuestionType): Promise<any> => {
  return await $post('/paper/add-question', params);
};

// 获取题目列表
export const getQuestionList = async (params: QuestionFilterType): Promise<any> => {
  return await $post('/paper/question-list', params);
};

// 删除题目
export const deleteQuestion = async (params: { ids: number[] }): Promise<any> => {
  return await $post('/paper/delete-question', params);
};
