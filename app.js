// app.js
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
  }
})
