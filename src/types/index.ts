export type CollapseType = boolean;

export type UserInfoType = {
  avatar: string;
  name: string;
};

// vuex的state类型
export interface State {
  isCollapse: CollapseType;
  userInfo: UserInfoType;
  userMenus: any;
}

// 添加用户类型
export interface AddUserInfoType {
  name: string;
  password?: string;
  email: string;
  roles: number[] | string[];
  desc: string;
}

// 用户列表参数类型
export interface UsersParamsType {
  name: string;
  pageNum: number;
  pageSize: number;
}

// 用户信息请求参数类型
export interface UserDetailParamsType {
  id: number | string;
}

// 用户信息更新类型
export interface UpdateUserInfoType {
  name: string;
  id: number | string;
  email: string;
  roles: number[] | string[];
  desc: string;
}

// 用户信息删除类型
export interface DeleteUserIdsType {
  ids: number[] | string[];
}

// 分类信息类型
export interface CategoryType {
  categoryLevel: number;
  categoryName: string;
  id: number | string;
  parentId: number | string;
  children?: CategoryType[];
}
