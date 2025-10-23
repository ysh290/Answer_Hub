Page({
  data: {
    questionId: '',
    questionData: {
      id: '',
      user: { name: '', avatar: '' },
      time: '',
      tags: [],
      tag: '',
      content: '',
      image: '',
      status: false,
      answerCount: 0,
      likes: 0,
      favorites: 0,
      hasPermission: false
    }
  },

  onLoad(options) {
    const { id } = options;
    this.setData({ questionId: id });
    this.loadQuestionData(id);
  },

  loadQuestionData(id) {
    // Mock data based on the screenshots
    const mockData = {
      '1':{
        id: '1',
        user: { 
          name: '赵修康', 
          avatar: '/static/人.png' 
        },
        time: '2025-10-16 22:03:06',
        tags: ['继电保护', '26届一批-湖北-本科'],
        tag: '继电保护',
        content: '老师,这个麻烦看一下',
        image: '/static/继电保护.png',
        status: true,
        answerCount: 1,
        likes: 1,
        favorites: 19,
        hasPermission: false
      },
      '2':{
        id: '2',
        user: { 
          name: '李海阳', 
          avatar: '/static/人.png' 
        },
        time: '8分钟前',
        tags: ['电路原理','26届一批-湖北-本科'],
        tag: '电路原理',
        content: '老师这个怎么分析',
        image: '/static/电路原理.png',
        status: false,
        answerCount: 0,
        likes: 0,
        favorites: 0,
        hasPermission: false
      }
    };
    
    const questionData = mockData[id] || {
      id: id,
      user: { 
        name: '未知用户', 
        avatar: '/static/人.png' 
      },
      time: '刚刚',
      tags: ['未知'],
      tag: '未知',
      content: '暂无内容',
      image: '',
      status: false,
      answerCount: 0,
      likes: 0,
      favorites: 0,
      hasPermission: false
    };
    
    this.setData({ questionData });
  },

  // Handle like action
  onLike() {
    const { questionData } = this.data;
    if (questionData) {
      questionData.likes += 1;
      this.setData({ questionData });
      wx.showToast({
        title: '点赞成功',
        icon: 'success'
      });
    }
  },

  // Handle favorite action
  onFavorite() {
    const { questionData } = this.data;
    if (questionData) {
      questionData.favorites += 1;
      this.setData({ questionData });
      wx.showToast({
        title: '收藏成功',
        icon: 'success'
      });
    }
  },

  // Handle share action
  onShare() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  // Handle comment action
  onComment() {
    wx.showToast({
      title: '评论功能开发中',
      icon: 'none'
    });
  },

  // Handle QR code scan
  onScanQR() {
    wx.showToast({
      title: '请使用微信扫描二维码',
      icon: 'none'
    });
  }
});