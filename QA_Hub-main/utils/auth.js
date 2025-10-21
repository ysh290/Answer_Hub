// 检查用户是否已登录
export function checkLogin() {
  const userInfo = wx.getStorageSync('user_info');
  return userInfo && userInfo.isLogin === true;
}

// 获取用户信息
export function getUserInfo() {
  return wx.getStorageSync('user_info') || {};
}

// 显示登录提醒弹窗
export function showLoginModal() {
  return new Promise((resolve) => {
    wx.showModal({
      title: '登录提醒',
      content: '请先登录后再使用此功能',
      confirmText: '去登录',
      cancelText: '返回首页',
      success: (res) => {
        if (res.confirm) {
          // 用户点击了"去登录"
          wx.navigateTo({
            url: '/pages/login/login',
            success: () => {
              resolve(true);
            },
            fail: () => {
              resolve(false);
            }
          });
        } else {
          // 用户点击了"返回首页"
          wx.switchTab({
            url: '/pages/square/square',
            success: () => {
              resolve(false);
            },
            fail: () => {
              resolve(false);
            }
          });
        }
      },
      fail: () => {
        resolve(false);
      }
    });
  });
}

// 需要登录的页面检查
export function requireLogin() {
  if (!checkLogin()) {
    showLoginModal();
    return false;
  }
  return true;
}
