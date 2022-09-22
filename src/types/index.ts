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

interface OptionsType {
  label: string;
  answer: string;
}

// 新增/编辑题目格式
export interface QuestionType {
  id?: number | string;
  // 试题分类
  categoryId: number;
  // 题目分类
  topicType: number;
  // 题目
  topic: string;
  // 选项
  options: OptionsType[];
  // 正确答案
  correctOption: string;
  // 描述
  parsing: string;
  // 难度: 0-容易 1-中等 2-困难
  level: number;
}

// 筛选题目参数
export interface QuestionFilterType {
  // 试题分类
  categoryId: number | string;
  // 难易程度
  level: number | string;
  // 题目类型
  topicType: number | string;
  // 题目名称
  topic: string;
  pageSize: number;
  pageNum: number;
}

// 菜单配置类型
export interface MenuType {
  id?: number;
  name: string;
  index: number;
  parentId?: number;
  sign: string;
}
