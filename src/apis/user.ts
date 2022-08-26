import { $post } from './base';

import {
  UsersParamsType,
  AddUserInfoType,
  UserDetailParamsType,
  UpdateUserInfoType,
  DeleteUserIdsType
} from '../types/index';

// 获取用户列表
export const getUsers = async (params: UsersParamsType): Promise<any> => {
  return await $post('/user/list', params);
};

// 添加用户
export const addUser = async (params: AddUserInfoType): Promise<any> => {
  return await $post('/user/add-users', params);
};

// 获取详情
export const getUserDetail = async (params: UserDetailParamsType): Promise<any> => {
  return await $post('/user/detail', params);
};

// 更新用户信息
export const updateUserInfo = async (params: UpdateUserInfoType): Promise<any> => {
  return await $post('/user/update', params);
};

// 删除用户
export const deleteUser = async (params: DeleteUserIdsType): Promise<any> => {
  return await $post('/user/delete', params);
};

export const login = async (params: any): Promise<any> => {
  return await $post('/user/login', params);
};
