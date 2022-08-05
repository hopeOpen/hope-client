/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
module.exports = {
  devServer: {
    host: 'localhost',
    port: 8080,
    https: false,
    open: true,
    proxy: {
      '/hope-api': {
        target: 'http://127.0.0.1:7002',
        changeOrigin: true
      }
    }
  },
  chainWebpack: (config) => {
    config.resolve.alias.set('@', path.resolve(__dirname, 'src'));
  },
  css: {
    loaderOptions: {
      sass: {
        // scss 变量挂在全局
        prependData: '@import "@/assets/style/variables.scss";'
      }
    },
    sourceMap: false
  }
};
