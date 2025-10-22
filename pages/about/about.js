Page({
  data: {
    appInfo: {
      name: '答疑宝典',
      version: 'v1.0.0',
      description: '专业的知识问答平台',
      features: [
        '专业知识问答',
        '实时在线答疑',
        '知识库搜索',
        '用户互动交流'
      ]
    }
  },

  onLoad() {
    // 页面加载时的逻辑
  },

  // 联系客服
  contactService() {
    wx.showModal({
      title: '联系客服',
      content: '客服电话：400-123-4567\n工作时间：9:00-18:00',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  // 意见反馈
  feedback() {
    wx.showModal({
      title: '意见反馈',
      content: '感谢您的宝贵意见！\n请通过客服电话或邮箱联系我们。',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  // 隐私政策
  privacyPolicy() {
    wx.showModal({
      title: '隐私政策',
      content: '我们重视您的隐私保护，详细政策请查看官网。',
      showCancel: false,
      confirmText: '知道了'
    });
  }
})
