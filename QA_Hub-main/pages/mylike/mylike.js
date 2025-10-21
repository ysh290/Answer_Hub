Page({
  data: {
    likes: []
  },
  
  onLoad() {
    this.loadLikes();
  },
  
  onShow() {
    this.loadLikes();
  },
  
  loadLikes() {
    // 从本地存储获取点赞数据
    const likes = wx.getStorageSync('likes') || [];
    this.setData({
      likes: likes
    });
  }
})
