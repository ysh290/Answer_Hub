// app.js
const COS = require('./utils/cos-wx-sdk-v5');
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 初始化用户信息
    this.initUserInfo()
  },
  
  // 初始化用户信息
  initUserInfo() {
    try {
      const userInfo = wx.getStorageSync('user_info')
      if (userInfo && userInfo.isLogin) {
        this.globalData.userInfo = userInfo
        console.log('从本地存储恢复用户信息:', userInfo)
      }
    } catch (error) {
      console.error('初始化用户信息失败:', error)
    }
  },
  
  // 设置用户信息到全局变量
  setUserInfo(userInfo) {
    this.globalData.userInfo = userInfo
    try {
      wx.setStorageSync('user_info', userInfo)
      console.log('用户信息已保存到全局变量和本地存储:', userInfo)
    } catch (error) {
      console.error('保存用户信息失败:', error)
    }
  },
  
  // 清除用户信息
  clearUserInfo() {
    this.globalData.userInfo = null
    try {
      wx.removeStorageSync('user_info')
      console.log('用户信息已清除')
    } catch (error) {
      console.error('清除用户信息失败:', error)
    }
  },
  
  // 获取用户信息
  getUserInfo() {
    return this.globalData.userInfo
  },
  
  // 检查是否已登录
  isLogin() {
    return this.globalData.userInfo && this.globalData.userInfo.isLogin
  },
  
  globalData: {
    userInfo: null,
    currentTab: 'all'
  },

cos :new COS({
    
}),
uploadImage: function (filePath, options = {}) {
    return new Promise((resolve, reject) => {
      const userInfo = this.getUserInfo()
      
      // 生成文件名，可以添加时间戳确保唯一性
      const timestamp = new Date().getTime()
      const fileName = `image_${timestamp}_${filePath.id}.jpg`
      
      // 构建完整的文件路径
      const cosKey = `questions/${userInfo.userId}/${fileName}`
      this.cos.postObject({
        Bucket: 'answer-hub-1258140596', // 存储桶名称
        Region: 'ap-shanghai', // 存储桶地域
        Key: cosKey, // 上传到 COS 的文件路径
        FilePath: filePath.url,
        onProgress: function (progressData) {
          console.log(JSON.stringify(progressData));
        }
      }, (err, data) => {
        if (err) {
          console.error('上传失败:', err);
          wx.showToast({
            title: '上传失败',
            icon: 'none'
          });
          reject(err);
        } else {
          console.log('上传成功:', data);
          const filecontent = data.Location; // 上传成功后获取文件的访问 URL
          resolve('https://' + filecontent);
        }
      });
    });
  }
})
