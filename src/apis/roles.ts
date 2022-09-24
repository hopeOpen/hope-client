import { $post } from './base';
import { RoleType } from '../types';

// 获取角色列表
export const getRoles = async (payload?: any): Promise<any> => {
  return await $post('/roles', payload);
};

// 新增角色
export const addRole = async (payload: RoleType): Promise<any> => {
  return await $post('/roles/add', payload);
};

// 删除角色
export const deleteRole = async (payload: { ids: number[] }): Promise<any> => {
  return await $post('/roles/delete', payload);
};
