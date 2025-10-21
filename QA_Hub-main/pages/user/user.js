// pages/user/user.js
const USER_INFO_KEY = 'user_info';

Page({
  data: {
    userInfo: {}
  },

  onLoad(options) {
    // 获取用户信息
    const userInfo = wx.getStorageSync(USER_INFO_KEY) || {};
    this.setData({ userInfo });
  },

  // 返回上一页
  goBack() {
    wx.navigateBack();
  },

  // 更换头像
  changeAvatar() {
    const that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        const tempFilePath = res.tempFilePaths[0];
        // 这里可以上传到服务器，现在先保存本地路径
        that.setData({
          'userInfo.avatar': tempFilePath
        });
      },
      fail: function(err) {
        console.error('选择图片失败:', err);
        wx.showToast({
          title: '选择图片失败',
          icon: 'none'
        });
      }
    });
  },

  // 昵称输入
  onNicknameInput(e) {
    this.setData({
      'userInfo.nickname': e.detail.value
    });
  },

  // 保存用户信息
  saveUserInfo() {
    const { userInfo } = this.data;
    
    if (!userInfo.nickname || userInfo.nickname.trim() === '') {
      wx.showToast({
        title: '请输入昵称',
        icon: 'none'
      });
      return;
    }

    // 保存到本地存储
    wx.setStorageSync(USER_INFO_KEY, userInfo);
    
    wx.showToast({
      title: '保存成功',
      icon: 'success'
    });

    // 延迟返回上一页
    setTimeout(() => {
      wx.navigateBack();
    }, 1500);
  }
})