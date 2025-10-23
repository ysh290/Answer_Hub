// API配置文件
const config = {
  // 开发环境
  development: {
    baseURL: 'http://127.0.0.1:8888',
    timeout: 30000
  },
  
  // 生产环境
  production: {
    baseURL: 'https://your-api-domain.com',
    timeout: 30000
  }
};

// 当前环境（可以根据需要修改）
const currentEnv = 'development';

// 导出当前环境的配置
module.exports = {
  baseURL: config[currentEnv].baseURL,
  timeout: config[currentEnv].timeout,
  
  // API接口地址
  apis: {
    login: '/user/login',
    register: '/user/register',
    sendCode: '/user/sendCode',
    resetPassword: '/user/resetPassword'
  }
};
