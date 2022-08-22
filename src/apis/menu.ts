import { $get } from './base';

// 获取用户菜单
export const getUserMenus = (params: any) => {
  return $get('/menu/permission', params);
};
