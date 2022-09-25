<template>
  <el-form
    ref="userFormRef"
    :model="userData"
    :rules="rules"
    label-width="120px"
    class="user-form"
    :size="formSize"
    status-icon
  >
    <el-form-item label="用户名" prop="name">
      <el-input v-model="userData.name" />
    </el-form-item>
    <el-form-item label="密码" prop="password" v-if="eType === 'add'">
      <el-input type="password" v-model="userData.password" />
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="userData.email" />
    </el-form-item>
    <el-form-item label="角色" prop="roles">
      <el-checkbox-group v-model="userData.roles">
        <el-checkbox :label="item.id" v-for="item in ruleTypes" :key="item.id">{{ item.roleName }}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="描述" prop="desc">
      <el-input :rows="2" maxlength="200" show-word-limit type="textarea" v-model="userData.desc" />
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { AddUserInfoType, RoleType } from '@/types/index';
import { FormRules } from 'element-plus';
import { getRoles } from '@/apis/roles';
export default defineComponent({
  name: 'AddForm',
  setup(props, { expose }) {
    const eType = ref('add');
    const userFormRef = ref();
    const userData = reactive<AddUserInfoType>({
      name: '',
      password: '',
      email: '',
      roles: [],
      desc: ''
    });
    const ruleTypes = ref<RoleType[]>([]);
    const rules = reactive<FormRules>({
      name: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 18, message: '长度3-18位', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 18, message: '长度6-18位', trigger: 'blur' }
      ],
      email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
      roles: [
        {
          type: 'array',
          required: true,
          message: '选择用户角色',
          trigger: 'change'
        }
      ],
      desc: [{ min: 0, max: 100, message: '长度6-18位', trigger: 'blur' }]
    });
    const init = (type = 'add', data: any) => {
      eType.value = type;
      Object.assign(
        userData,
        {
          name: '',
          password: '',
          email: '',
          roles: [],
          desc: ''
        },
        data
      );
    };
    const getRolesAction = async () => {
      try {
        const result = await getRoles();
        ruleTypes.value = result.list;
      } catch (error) {
        console.log(error);
      }
    };
    getRolesAction();
    expose({
      userFormRef,
      userData,
      init
    });
    return {
      userFormRef,
      userData,
      rules,
      eType,
      ruleTypes
    };
  }
});
</script>

<style lang="scss">
.user-form {
  .el-form-item__label {
    width: 80px !important;
  }
}
</style>
