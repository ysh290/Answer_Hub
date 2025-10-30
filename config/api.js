// API配置文件
const app = getApp(); // 获取全局 App 实例
const userInfo = app.globalData.userInfo; // 从全局变量中获取用户信息
const config = {
  // 开发环境
  development: {
    baseURL: 'http://127.0.0.1:8777',
    timeout: 30000,
    
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
  headers: config[currentEnv].headers || {}, // 如果当前环境没有 headers，则默认为空对象
  // API接口地址
  apis: {
    login: '/user/login',
    register: '/user/register',
    sendCode: '/user/sendCode',
    resetPassword: '/user/resetPassword'
  }
};
