import Axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';
import { ElMessage } from 'element-plus';

type response = AxiosResponse<any>;

const axiosInstance: AxiosInstance = Axios.create({
  baseURL: '/hope-api',
  timeout: 10000,
  withCredentials: true
});

axiosInstance.interceptors.request.use(
  (config) => {
    const params: any = {};
    Object.keys(config.params || {}).forEach((key: string) => {
      params[key] = encodeURIComponent(config.params[key]);
    });
    config.params = params;
    return config;
  },
  (error) => {
    // 请求错误处理
    ElMessage({
      message: `Send request failed: ${error.message}`,
      type: 'error'
    });
    return Promise.reject(error);
  }
);

// 响应成功处理
axiosInstance.interceptors.response.use((response) => {
  const { status, statusText, data: responseData } = response;
  if (status === 200) {
    if (responseData.code === 200) {
      return Promise.resolve(responseData.data);
    } else {
      ElMessage({
        message: responseData.data.message,
        type: 'error'
      });
      return Promise.reject(responseData.data.message || '未知错误');
    }
  } else {
    return Promise.reject(new Error(statusText));
  }
});

// PERFORMANCE: 参照useRequest, swr进行设计
// 封装get和post请求方法，提供统一的错误处理和参数校验逻辑
export const $get = async (url: string, data: any = {}, configs: AxiosRequestConfig = {}): Promise<response> => {
  return axiosInstance.get(url, {
    ...configs,
    params: data
  });
};
export const $post = async (url: string, data: any = {}, configs: AxiosRequestConfig = {}): Promise<response> => {
  return axiosInstance.post(url, data, configs);
};

// 挂载到全局，方便调试
Object.assign(window, {
  httpMethod: {
    $get,
    $post
  }
});
