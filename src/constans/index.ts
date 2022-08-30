interface RuleTypes {
  ADMIN: number;
  GENERAL: number;
}

export const RULE_TYPES: RuleTypes = {
  ADMIN: 0,
  GENERAL: 1
};

// 分类等级
export const CategoryLevel = {
  // 一级
  FIRST_LEVEL: 1,
  // 二级
  SECONDARY_LEVEL: 2
};

// 题目类型
export const topicTypes = [
  {
    label: '单选题',
    key: 0
  },
  {
    label: '多选题',
    key: 1
  }
];

// 题目难度
export const LEVEL_TYPES = {
  EASY: 0,
  MEDIUM: 1,
  HARD: 2
};

// 题目难度
export const topicLevels = [
  {
    label: '简单',
    level: LEVEL_TYPES.EASY
  },
  {
    label: '中等',
    level: LEVEL_TYPES.MEDIUM
  },
  {
    label: '困难',
    level: LEVEL_TYPES.HARD
  }
];
