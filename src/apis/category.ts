import { $post } from './base';

// 新增分类
export const addCategory = async (data: any): Promise<any> => {
  return await $post('/paper/add-category', data);
};

// 更新分类
export const updateCategory = async (data: any): Promise<any> => {
  return await $post('/paper/update-category', data);
};

// 分类列表
export const categoryList = async (): Promise<any> => {
  return await $post('/paper/category-list');
};

// 删除分类
export const deleteCategory = async (data: { id: string | number }): Promise<any> => {
  return await $post('/paper/delete-category', data);
};

// 搜索分类
export const searchCategory = async (data: { categoryName: string }): Promise<any> => {
  return await $post('/paper/search-category', data);
};
