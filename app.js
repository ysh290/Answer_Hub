// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
<<<<<<< HEAD
    userInfo: null,
    currentTab: 'all'
=======
    userInfo: null
>>>>>>> 76ecb50dd8ab3b0f753cebc9bd23af6c44997fa6
  }
})
