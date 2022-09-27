<template>
  <div class="login-wrap">
    <main class="main-left">
      <img class="login-img" src="../../assets//images/login-box-bg.svg" alt="" />
    </main>
    <main class="main-right">
      <section class="form-block">
        <el-form ref="form" :model="info" label-width="auto" label-position="top">
          <p class="title">登陆</p>
          <el-form-item label="用户名">
            <el-input v-model="info.name" />
          </el-form-item>
          <el-form-item label="密码">
            <el-input type="password" v-model="info.password" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">登陆</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="onRegister">注册</el-button>
          </el-form-item>
        </el-form>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { login } from '../../apis/user';
import { useRouter, useRoute, LocationQueryRaw } from 'vue-router';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';
const router = useRouter();
const route = useRoute();
const store = useStore();
const info = reactive({
  name: '',
  password: ''
});
const redirect: string | null = route.query.redirect as string;
// 其他参数
const otherQuery = (query: any): LocationQueryRaw => {
  return Object.keys(query).reduce((acc: LocationQueryRaw, cur: string) => {
    if (cur !== 'redirect') {
      acc[cur] = query[cur];
    }
    return acc;
  }, {});
};
otherQuery(route.query);
const onSubmit = () => {
  login(info)
    .then(async (data) => {
      if (data.code === 200) {
        ElMessage({
          message: '登陆成功',
          type: 'success'
        });
        await store.dispatch('handleUserMenus');
        setTimeout(() => {
          router.push({ path: redirect || '/', query: { ...otherQuery } });
        }, 500);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const onRegister = () => {
  console.log('注册');
};
</script>

<style lang="scss">
.login-wrap {
  display: flex;
  height: 100%;
  width: 100%;
  background-color: #293146;
  main {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    padding: 20px;
    &.main-left {
      .login-img {
        width: 350px;
      }
    }
    &.main-right {
      background: white;
      .form-block {
        width: 500px;
        padding: 20px;
        border-radius: 10px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: white;
        overflow: hidden;
        margin-top: -10vh;
        .el-form {
          width: 80%;
          .title {
            text-align: center;
            font-size: 20px;
          }
          .el-button {
            width: 100%;
          }
        }
      }
    }
  }
}
</style>
