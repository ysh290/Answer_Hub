const STORAGE_KEY = 'qa_questions';
const USER_INFO_KEY = 'user_info';
import { requireLogin } from '../../utils/auth.js';

Page({
  data: { 
    stats: { total: 0, pending: 0, resolved: 0, adopted: 0 },
    userInfo: {}
  },
  onShow() {
    // 检查登录状态
    if (!requireLogin()) {
      return;
    }
    
    const list = wx.getStorageSync(STORAGE_KEY) || [];
    const stats = {
      total: list.length,
      pending: list.filter(i => i.status==='pending').length,
      resolved: list.filter(i => i.status==='resolved').length,
      adopted: list.filter(i => i.status==='adopted').length
    };
    
    // 获取用户信息
    const userInfo = wx.getStorageSync(USER_INFO_KEY) || {};
    
    this.setData({ stats, userInfo });
  },
  
  // 跳转到用户信息页面
  goToUserInfo() {
    wx.navigateTo({
      url: '/pages/user/user'
    });
  },

  // 跳转到我的提问页面
  goToMyAsk() {
    if (!requireLogin()) {
      return;
    }
    wx.switchTab({
      url: '/pages/myask/myask'
    });
  },

  // 跳转到待解答页面
  goToPending() {
    if (!requireLogin()) {
      return;
    }
    wx.switchTab({
      url: '/pages/myask/myask?tab=pending'
    });
  },

  // 跳转到已解答页面
  goToResolved() {
    if (!requireLogin()) {
      return;
    }
    wx.switchTab({
      url: '/pages/myask/myask?tab=resolved'
    });
  },

  // 跳转到已采纳页面
  goToAdopted() {
    if (!requireLogin()) {
      return;
    }
    wx.switchTab({
      url: '/pages/myask/myask?tab=adopted'
    });
  },

  // 跳转到我的收藏页面
  goToCollection() {
    if (!requireLogin()) {
      return;
    }
    wx.navigateTo({
      url: '/pages/collection/collection'
    });
  },

  // 跳转到我的回答页面
  goToMyComment() {
    if (!requireLogin()) {
      return;
    }
    wx.switchTab({
      url: '/pages/mycomment/mycomment'
    });
  },

  // 跳转到我的点赞页面
  goToMyLike() {
    if (!requireLogin()) {
      return;
    }
    wx.navigateTo({
      url: '/pages/mylike/mylike'
    });
  },

  // 跳转到修改密码页面
  goToChangePassword() {
    if (!requireLogin()) {
      return;
    }
    wx.navigateTo({
      url: '/pages/changepassword/changepassword'
    });
  },

  // 跳转到关于我们页面
  goToAbout() {
    if (!requireLogin()) {
      return;
    }
    wx.navigateTo({
      url: '/pages/about/about'
    });
  },

  // 退出登录
  logout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      confirmText: '确定',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          // 清除用户信息
          wx.removeStorageSync(USER_INFO_KEY);
          
          // 清除其他相关数据
          wx.removeStorageSync('qa_questions');
          
          // 显示退出成功提示
          wx.showToast({
            title: '已退出登录',
            icon: 'success',
            duration: 1500
          });
          
          // 重新加载页面数据（会触发登录检查）
          setTimeout(() => {
            this.onShow();
          }, 1500);
        }
      }
    });
  }
});

