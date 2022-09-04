<template>
  <div class="qu-wrapper">
    <category :category="categoryData" @fetch="fetchCategory" v-model:categoryId="query.categoryId" />
    <main class="qu-main e-container">
      <!-- 筛选项 -->
      <header class="qu-header">
        <!-- 题目类型 -->
        <el-select v-model="query.topicType" placeholder="题目类型" clearable>
          <el-option v-for="item in topicTypes" :key="item.key" :label="item.label" :value="item.key" />
        </el-select>
        <!-- 题目难度 -->
        <el-select v-model="query.level" placeholder="题目难度" clearable>
          <el-option v-for="item in topicLevels" :key="item.level" :label="item.label" :value="item.level" />
        </el-select>
      </header>
      <!-- 表格 -->
      <hope-table
        v-model:query="query"
        :tableConfig="tableConfig"
        :tableData="tableData"
        :colConfig="colConfig"
        :total="total"
        @edit="handleEditor"
        @delete="handleDelete"
      >
        <!-- 展开的数据 -->
        <template v-slot:expand>
          <el-table-column type="expand">
            <template #default="scope">
              <topic-details :data="scope.row" />
            </template>
          </el-table-column>
        </template>
        <!-- 题目 -->
        <template v-slot:topic>
          <el-table-column label="题目" width="200px">
            <template #default="scope">
              <div class="content-ellipsis">{{ getContent(scope.row.topic) }}</div>
            </template>
          </el-table-column>
        </template>
        <!-- 分类 -->
        <template v-slot:categoryId>
          <el-table-column label="所属分类">
            <template #default="scope">
              <div>{{ getCategoryLabel(scope.row) }}</div>
            </template>
          </el-table-column>
        </template>
        <!-- 所属类型 -->
        <template v-slot:topicType>
          <el-table-column label="所属类型">
            <template #default="scope">
              <div>{{ getTopicTypeLabel(scope.row.topicType) }}</div>
            </template>
          </el-table-column>
        </template>
        <!-- 难度 -->
        <template v-slot:level>
          <el-table-column label="难度">
            <template #default="scope">
              <span class="label-tip" :class="labelStyle(scope.row.level)">{{ getLabelLabel(scope.row.level) }}</span>
            </template>
          </el-table-column>
        </template>
      </hope-table>
    </main>
  </div>
</template>
<script setup lang="ts">
import Category from '@/views/components/category/index.vue';
import HopeTable from '@/views/components/hopeTable/index.vue';
import TopicDetails from './components/topicDetails.vue';
import { categoryList } from '@/apis/category';
import { reactive, ref, watch } from 'vue';
import { CategoryType, QuestionFilterType, QuestionType } from '@/types/index';
import { topicTypes, topicLevels, LEVEL_TYPES } from '@/constants';
import { getQuestionList, deleteQuestion } from '@/apis/testQuestion';
import { ElMessage } from 'element-plus';

const query = ref<QuestionFilterType>({
  // 分类id
  categoryId: '',
  // 难易程度
  level: '',
  // 题目类型
  topicType: '',
  // 题目名称
  topic: '',
  pageSize: 10,
  pageNum: 1
});

const total = ref<number>(0);

watch(
  query,
  () => {
    fetchData();
  },
  { deep: true }
);

const tableData: any = ref([]);
const tableConfig = {
  width: '100%',
  headerCellStyle: {
    background: '#f4f4f4'
  },
  selection: true
};
// table 列展示
const colConfig = [
  {
    slot: 'expand'
  },
  {
    slot: 'topic'
  },
  {
    slot: 'categoryId'
  },
  {
    slot: 'topicType'
  },
  {
    slot: 'level'
  }
];

// 获取分类列表
const categoryData: CategoryType[] = reactive([]);
const categoryMap = new Map();
const fetchCategory = () => {
  categoryList().then((res) => {
    categoryData.length = 0;
    categoryData.push(...res);
  });
};
fetchCategory();
watch(categoryData, () => {
  // 清楚old数据
  categoryMap.clear();
  treeToFlat(categoryData);
});
const treeToFlat = (arr: CategoryType[]) => {
  arr.forEach((item: CategoryType) => {
    if (!categoryMap.has(item.id)) {
      categoryMap.set(item.id, item);
      treeToFlat(item.children || []);
    }
  });
};

// 获取题目列表
const fetchData = async () => {
  try {
    const result = await getQuestionList(query.value);
    tableData.value = result.list || [];
    total.value = result.total;
  } catch (error) {
    console.log(error);
  }
};
fetchData();

// 获取题目名称
const getContent = (content: string) => {
  return content.replace(/<[^<>]+>/g, '');
};
// 获取分类名称
const getCategoryLabel = (data: any) => {
  if (!data.categoryId) return '-';
  return categoryMap.get(data.categoryId).categoryName;
};
// 获取题目所属类型
const getTopicTypeLabel = (type: string | number) => {
  const result = topicTypes.find((item) => item.key === type);
  return result ? result.label : '-';
};
// 获取题目难易程度
const getLabelLabel = (type: string | number) => {
  const result = topicLevels.find((item) => item.level === type);
  return result ? result.label : '-';
};
// 获取样式
const labelStyle = (type: string | number) => {
  const { EASY, MEDIUM, HARD } = LEVEL_TYPES;
  switch (type) {
    case EASY:
      return 'is-easy';
    case MEDIUM:
      return 'is-medium';
    case HARD:
      return 'is-hard';
    default:
      return '';
  }
};

// 编辑
const handleEditor = (data: QuestionType) => {
  console.log(data);
};
// 删除
const handleDelete = async (data: { ids: number[] }) => {
  try {
    await deleteQuestion(data);
    ElMessage({
      type: 'success',
      message: '删除成功'
    });
    fetchData();
  } catch (error) {
    console.log(error);
  }
};
</script>
<style lang="scss">
.qu-wrapper {
  display: flex;
  height: 100%;
  .qu-main {
    flex: 1;
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    .qu-header {
      margin-bottom: 20px;
      .el-select {
        width: 100px;
        margin-right: 20px;
      }
    }
    .label-tip {
      padding: 1px 6px;
      border-radius: 4px;
      background-color: red;
      color: white;
      font-size: 12px;
      &.is-easy {
        background-color: $color-success;
      }
      &.is-medium {
        background-color: $color-warn;
      }
      &.is-hard {
        background-color: $color-danger;
      }
    }
  }
}
</style>
