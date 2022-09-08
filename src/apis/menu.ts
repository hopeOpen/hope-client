import { $get, $post } from './base';

// 获取用户菜单
export const getUserMenus = async (params: any): Promise<any> => {
  return await $get('/menu/permission', params);
};

// 获取菜单配置
export const getMenusConfig = async (): Promise<any> => {
  return await $post('/menu/config');
};
